"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = exports.login = exports.register = void 0;
const User_1 = require("../models/User");
const RegionInfo_1 = require("../models/RegionInfo");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// 회원가입
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // 이메일 중복 체크
        const existingUser = await User_1.User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: '이미 등록된 이메일입니다.' });
        }
        // 비밀번호 해시화
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // 사용자 생성
        const user = await User_1.User.create({
            name,
            email,
            password: hashedPassword,
        });
        // JWT 토큰 생성
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
        res.status(201).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    }
    catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: '회원가입 중 오류가 발생했습니다.' });
    }
};
exports.register = register;
// 로그인
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // 사용자 찾기
        const user = await User_1.User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
        }
        // 비밀번호 확인
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
        }
        // JWT 토큰 생성
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: '로그인 중 오류가 발생했습니다.' });
    }
};
exports.login = login;
// 프로필 조회
const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User_1.User.findByPk(userId, {
            attributes: { exclude: ['password'] },
            include: [{
                    model: RegionInfo_1.RegionInfo,
                    as: 'regionInfos'
                }]
        });
        if (!user) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }
        res.json(user);
    }
    catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: '프로필 조회 중 오류가 발생했습니다.' });
    }
};
exports.getProfile = getProfile;
// 프로필 수정
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, email, password, profileImage, regionInfo, rating } = req.body;
        const user = await User_1.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }
        // 이메일 변경 시 중복 체크
        if (email && email !== user.email) {
            const existingUser = await User_1.User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: '이미 사용 중인 이메일입니다.' });
            }
        }
        // 업데이트할 데이터 준비
        const updateData = {};
        if (name)
            updateData.name = name;
        if (email)
            updateData.email = email;
        if (password) {
            updateData.password = await bcryptjs_1.default.hash(password, 10);
        }
        if (profileImage)
            updateData.profileImage = profileImage;
        if (rating !== undefined)
            updateData.rating = rating;
        // 프로필 업데이트
        await user.update(updateData);
        // 지역 정보 업데이트
        if (regionInfo) {
            // 최대 2개까지만 등록 가능
            if (regionInfo.length > 2) {
                return res.status(400).json({ message: '지역 정보는 최대 2개까지만 등록 가능합니다.' });
            }
            // 기존 지역 정보 삭제
            await RegionInfo_1.RegionInfo.destroy({ where: { userId } });
            // 새로운 지역 정보 추가
            await RegionInfo_1.RegionInfo.bulkCreate(regionInfo.map((region) => (Object.assign(Object.assign({}, region), { userId }))));
        }
        // 업데이트된 사용자 정보 조회 (비밀번호 제외)
        const updatedUser = await User_1.User.findByPk(userId, {
            attributes: { exclude: ['password'] },
            include: [{
                    model: RegionInfo_1.RegionInfo,
                    as: 'regionInfos'
                }]
        });
        res.json(updatedUser);
    }
    catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: '프로필 수정 중 오류가 발생했습니다.' });
    }
};
exports.updateProfile = updateProfile;
