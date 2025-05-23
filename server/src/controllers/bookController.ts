import { Request, Response } from 'express';
import { Book } from '../models/Book';
import { User } from '../models/User';
import { Op } from 'sequelize';
import { sequelize } from '../config/database';

// 도서 검색 및 조회 (필터링, 정렬 포함)
export const getBooks = async (req: Request, res: Response) => {
  try {
    const { 
      genres, 
      condition, 
      status, 
      sort = 'date' // 기본값은 등록순
    } = req.query;

    const where: any = {};

    // 장르 필터
    if (genres) {
      const genreArray = (genres as string).split('+').map(genre => genre.trim());
      // '전체'가 포함되어 있으면 장르 필터링을 하지 않음
      if (!genreArray.includes('전체')) {
        where.genres = {
          [Op.overlap]: genreArray
        };
      }
    }

    // 상태 필터
    if (condition) {
      where.condition = condition;
    }

    // 교환 상태 필터
    if (status) {
      where.status = status;
    }

    // 정렬 옵션 설정
    let order: any[] = [];
    // 등록순 정렬 (기본값)
    order.push(['registeredDate', 'DESC']);

    const books = await Book.findAll({
      where,
      order,
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'name'], // 소유자 정보를 id와 name만 포함
      }],
    });

    res.json(books);
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ message: '도서 목록 조회 중 오류가 발생했습니다.' });
  }
};

// 특정 책 조회
export const getBookById = async (req: Request, res: Response) => {
  try {
    const book = await Book.findByPk(req.params.id, {
      include: [{
        model: User,
        attributes: ['id', 'name'], // 소유자 정보를 id와 name만 포함
      }],
    });
    if (!book) {
      return res.status(404).json({ message: '책을 찾을 수 없습니다.' });
    }
    res.json(book);
  } catch (error) {
    console.error('Get book by id error:', error);
    res.status(500).json({ message: '책 조회 중 오류가 발생했습니다.' });
  }
};

// 새 책 등록
export const createBook = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const book = await Book.create({
      ...req.body,
      ownerId: userId,
    });

    const bookWithOwner = await Book.findByPk(book.id, {
      include: [{
        model: User,
        attributes: ['id', 'name'], // 소유자 정보를 id와 name만 포함
      }],
    });

    res.status(201).json(bookWithOwner);
  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({ message: '책 등록 중 오류가 발생했습니다.' });
  }
};

// 책 정보 수정
export const updateBook = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return res.status(404).json({ message: '책을 찾을 수 없습니다.' });
    }

    if (book.ownerId !== userId) {
      return res.status(403).json({ message: '수정 권한이 없습니다.' });
    }

    await book.update(req.body);

    const updatedBook = await Book.findByPk(book.id, {
      include: [{
        model: User,
        attributes: ['id', 'name'], // 소유자 정보를 id와 name만 포함
      }],
    });

    res.json(updatedBook);
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ message: '책 수정 중 오류가 발생했습니다.' });
  }
};

// 책 삭제
export const deleteBook = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return res.status(404).json({ message: '책을 찾을 수 없습니다.' });
    }

    if (book.ownerId !== userId) {
      return res.status(403).json({ message: '삭제 권한이 없습니다.' });
    }

    await book.destroy();
    res.json({ message: '책이 삭제되었습니다.' });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ message: '책 삭제 중 오류가 발생했습니다.' });
  }
};

// 두 지점 간의 거리 계산 (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // 지구의 반경 (km)
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export const searchBooks = async (req: Request, res: Response) => {
  try {
    const { genres, condition, status, lat, lng, radius = 5, sort = 'date' } = req.query;

    const where: any = {};

    // 장르 필터
    if (genres) {
      const genreArray = (genres as string).split('+').map(g => g.trim());
      // '전체'가 포함되어 있으면 장르 필터링을 하지 않음
      if (!genreArray.includes('전체')) {
        where.genres = {
          [Op.contains]: genreArray
        };
      }
    }

    // 도서 상태 필터
    if (condition) {
      where.condition = condition;
    }

    // 교환 상태 필터
    if (status) {
      where.status = status;
    }

    // 위치 기반 필터링
    let order: any[] = [];
    if (lat && lng && sort === 'distance') {
      const point = `POINT(${lng} ${lat})`;
      order = [
        [sequelize.literal(`ST_Distance(
          ST_SetSRID(ST_MakePoint(geolocation->>'lng', geolocation->>'lat'), 4326)::geography,
          ST_SetSRID(ST_GeomFromText('${point}'), 4326)::geography
        )`), 'ASC']
      ];
    } else {
      // 기본 정렬: 등록일 기준 내림차순
      order = [['registeredDate', 'DESC']];
    }

    const books = await Book.findAll({
      where,
      order,
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'name']
      }]
    });

    res.json(books);
  } catch (error) {
    console.error('Error searching books:', error);
    res.status(500).json({ message: '도서 검색 중 오류가 발생했습니다.' });
  }
}; 