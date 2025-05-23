import { Request, Response } from 'express';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/auth';

// 구글 로그인 처리
export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: 'Invalid Google credential' });
    }

    // Decode the credential
    const decodedToken = JSON.parse(Buffer.from(credential.split('.')[1], 'base64').toString());
    const { email, name, picture } = decodedToken;

    if (!email) {
      return res.status(400).json({ message: '이메일 정보 제공에 동의해주세요.' });
    }

    // Check if user exists
    let user = await User.findOne({
      where: {
        email,
      },
    });

    if (user) {
      // Check if user is using the same provider
      if (user.provider !== 'google') {
        return res.status(400).json({ message: '이미 다른 방식으로 가입된 이메일입니다.' });
      }
    } else {
      // Create new user
      user = await User.create({
        id: `google_${Date.now()}`,
        email,
        name,
        profileImage: picture,
        provider: 'google',
        rating: 0,
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profileImage: user.profileImage,
        provider: user.provider,
      },
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ message: '구글 로그인 중 오류가 발생했습니다.' });
  }
};

// 카카오 로그인 처리
export const kakaoLogin = async (req: Request, res: Response) => {
  try {
    const { kakaoData } = req.body;

    if (!kakaoData || !kakaoData.kakao_account) {
      return res.status(400).json({ message: 'Invalid Kakao data' });
    }

    const { email, profile } = kakaoData.kakao_account;

    if (!email) {
      return res.status(400).json({ message: '이메일 정보 제공에 동의해주세요.' });
    }

    // Check if user exists
    let user = await User.findOne({
      where: {
        email,
      },
    });

    if (user) {
      // Check if user is using the same provider
      if (user.provider !== 'kakao') {
        return res.status(400).json({ message: '이미 다른 방식으로 가입된 이메일입니다.' });
      }
    } else {
      // Create new user
      user = await User.create({
        id: `kakao_${Date.now()}`,
        email,
        name: profile.nickname,
        profileImage: profile.profile_image_url,
        provider: 'kakao',
        rating: 0,
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profileImage: user.profileImage,
        provider: user.provider,
      },
    });
  } catch (error) {
    console.error('Kakao login error:', error);
    res.status(500).json({ message: '카카오 로그인 중 오류가 발생했습니다.' });
  }
}; 