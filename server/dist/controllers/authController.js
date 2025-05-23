"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.kakaoLogin = exports.googleLogin = void 0;
const User_1 = require("../models/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sequelize_1 = require("sequelize");
// 구글 로그인 처리
const googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;
        const decodedToken = JSON.parse(atob(credential.split('.')[1]));
        // 구글 데이터로 User 객체 생성
        const { sub: googleId, email, name, picture } = decodedToken;
        // 기존 사용자 확인
        let user = await User_1.User.findOne({
            where: {
                [sequelize_1.Op.or]: [
                    { email },
                    { provider: 'google', id: googleId }
                ]
            }
        });
        if (!user) {
            // 새 사용자 생성
            user = await User_1.User.create({
                id: googleId,
                email,
                name: decodeURIComponent(escape(name)), // 한글 디코딩
                profileImage: picture,
                provider: 'google',
                rating: 0
            });
        }
        else if (user.provider !== 'google') {
            // 다른 provider로 가입된 이메일인 경우
            return res.status(400).json({
                message: '이미 다른 방식으로 가입된 이메일입니다.'
            });
        }
        // JWT 토큰 생성
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                profileImage: user.profileImage,
                provider: user.provider,
                rating: user.rating
            }
        });
    }
    catch (error) {
        console.error('Google login error:', error);
        res.status(500).json({ message: '구글 로그인 중 오류가 발생했습니다.' });
    }
};
exports.googleLogin = googleLogin;
// 카카오 로그인 처리
const kakaoLogin = async (req, res) => {
    try {
        const { kakaoData } = req.body;
        const { id: kakaoId, kakao_account } = kakaoData;
        const { email, profile } = kakao_account;
        if (!email) {
            return res.status(400).json({
                message: '이메일 정보 제공에 동의해주세요.'
            });
        }
        // 기존 사용자 확인
        let user = await User_1.User.findOne({
            where: {
                [sequelize_1.Op.or]: [
                    { email },
                    { provider: 'kakao', id: kakaoId.toString() }
                ]
            }
        });
        if (!user) {
            // 새 사용자 생성
            user = await User_1.User.create({
                id: kakaoId.toString(),
                email,
                name: profile.nickname,
                profileImage: profile.profile_image_url,
                provider: 'kakao',
                rating: 0
            });
        }
        else if (user.provider !== 'kakao') {
            // 다른 provider로 가입된 이메일인 경우
            return res.status(400).json({
                message: '이미 다른 방식으로 가입된 이메일입니다.'
            });
        }
        // JWT 토큰 생성
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                profileImage: user.profileImage,
                provider: user.provider,
                rating: user.rating
            }
        });
    }
    catch (error) {
        console.error('Kakao login error:', error);
        res.status(500).json({ message: '카카오 로그인 중 오류가 발생했습니다.' });
    }
};
exports.kakaoLogin = kakaoLogin;
