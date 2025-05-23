import express from 'express';
import { googleLogin, kakaoLogin } from '../controllers/authController';

const router = express.Router();

// 소셜 로그인 라우트
router.post('/google', googleLogin);
router.post('/kakao', kakaoLogin);

export default router; 