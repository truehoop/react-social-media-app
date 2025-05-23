import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import BookRegisterForm from '@components/bookRegister/BookRegisterForm';
import BookRegisterHeader from '@components/bookRegister/BookRegisterHeader';
import BookSearchDialog from '@components/bookRegister/BookSearchDialog';
import { useUser } from '@contexts/UserContext';
import { searchBookByTitle } from '@helpers/api/books';
import { BookInfo } from '@helpers/types/api';

const GENRES = ['소설', '에세이', '고전문학', '현대문학', '판타지', 'SF', '로맨스', '자기계발', '인문학', '역사', '음악', '스포츠'];

// Kakao 행정동 정보 API 호출 함수
interface RegionInfo {
  regionType: string;
  code: string;
  addressName: string;
  region1: string;
  region2: string;
  region3: string;
}

const getAddressFromCoordinates = async (latitude: number, longitude: number): Promise<RegionInfo | null> => {
  try {
    const response = await fetch(`https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${longitude}&y=${latitude}`, {
      headers: {
        Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_API_KEY}`,
      },
    });
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    if (data.documents && data.documents.length > 0) {
      const region = data.documents[0];
      return {
        regionType: region.region_type,
        code: region.code,
        addressName: region.address_name,
        region1: region.region_1depth_name,
        region2: region.region_2depth_name,
        region3: region.region_3depth_name,
      };
    }
    return null;
  } catch (error) {
    return null;
  }
};

export default function BookRegisterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [condition, setCondition] = useState('');
  const [description, setDescription] = useState('');
  const [wish, setWish] = useState('');
  const [searchResults, setSearchResults] = useState<BookInfo[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [genreDialogOpen, setGenreDialogOpen] = useState(false);
  const [tempGenres, setTempGenres] = useState<string[]>([]);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();

  // Kakao book search
  const handleBookSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const response = await searchBookByTitle(searchQuery);
      setSearchResults(response.documents);
      setIsDialogOpen(true);
    } catch (error) {
      alert('도서 검색 중 오류가 발생했습니다.');
    } finally {
      setIsSearching(false);
    }
  };

  // Book select from search dialog
  const handleBookSelect = (book: BookInfo) => {
    setTitle(book.title);
    setAuthor(book.authors.join(', '));
    setIsDialogOpen(false);
    if (book.thumbnail) {
      setImages((prev) => [book.thumbnail, ...prev.slice(0, 2)]);
    }
  };

  // Image upload (max 3)
  const handleAddImage = (e?: React.ChangeEvent<HTMLInputElement>) => {
    if (images.length >= 3) return;
    if (e && e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (typeof ev.target?.result === 'string') {
          setImages((prev) => (prev.length < 3 ? [...prev, ev.target!.result as string] : prev));
        }
      };
      reader.readAsDataURL(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } else {
      setImages((prev) => (prev.length < 3 ? [...prev, 'https://via.placeholder.com/80x100?text=Book'] : prev));
    }
  };
  const handleImageUploadClick = () => {
    if (images.length < 3 && fileInputRef.current) fileInputRef.current.click();
  };
  const handleRemoveImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  // Genre dialog
  const openGenreDialog = () => {
    setTempGenres(selectedGenres);
    setGenreDialogOpen(true);
  };
  const closeGenreDialog = () => {
    setGenreDialogOpen(false);
  };
  const confirmGenreDialog = () => {
    setSelectedGenres(tempGenres);
    setGenreDialogOpen(false);
  };
  const handleGenreToggle = (genre: string) => {
    if (tempGenres.includes(genre)) {
      setTempGenres((prev) => prev.filter((g) => g !== genre));
    } else if (tempGenres.length < 2) {
      setTempGenres((prev) => [...prev, genre]);
    }
  };

  // Register
  const handleRegister = async () => {
    // 사용자의 활동지역 정보가 있으면 그것을 사용하고, 없으면 현재 위치를 가져옴
    let regionInfo: RegionInfo | null = null;

    if (user?.regionInfo && user.regionInfo.length > 0) {
      // 사용자의 첫 번째 활동지역을 사용
      regionInfo = user.regionInfo[0];
    } else if (navigator.geolocation) {
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        regionInfo = await getAddressFromCoordinates(pos.coords.latitude, pos.coords.longitude);
      } catch (e) {
        regionInfo = null;
      }
    }

    const newBook = {
      title,
      image: images[0] || '',
      genres: selectedGenres,
      condition,
      status: '교환가능',
      registeredDate: new Date().toISOString().slice(0, 10),
      geolocation: { lat: 37.5, lng: 127.03 },
      regionInfo,
    };
    navigate('/', { state: { newBook } });
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center">
      <BookRegisterHeader
        onBack={() => navigate(-1)}
        onSubmit={handleRegister}
      />
      <BookRegisterForm
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onBookSearch={handleBookSearch}
        isSearching={isSearching}
        title={title}
        setTitle={setTitle}
        author={author}
        setAuthor={setAuthor}
        condition={condition}
        setCondition={setCondition}
        description={description}
        setDescription={setDescription}
        wish={wish}
        setWish={setWish}
        images={images}
        onAddImage={handleAddImage}
        onImageUploadClick={handleImageUploadClick}
        onRemoveImage={handleRemoveImage}
        fileInputRef={fileInputRef}
        selectedGenres={selectedGenres}
        openGenreDialog={openGenreDialog}
        genreDialogOpen={genreDialogOpen}
        tempGenres={tempGenres}
        closeGenreDialog={closeGenreDialog}
        confirmGenreDialog={confirmGenreDialog}
        handleGenreToggle={handleGenreToggle}
        setTempGenres={setTempGenres}
        handleRegister={handleRegister}
        GENRES={GENRES}
      />
      <BookSearchDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        books={searchResults}
        onSelect={handleBookSelect}
      />
    </div>
  );
}
