"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const User_1 = require("../models/User");
const RegionInfo_1 = require("../models/RegionInfo");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
describe('User Controller Tests', () => {
    let authToken;
    let testUser;
    beforeEach(async () => {
        // 테스트용 사용자 생성
        const hashedPassword = await bcryptjs_1.default.hash('password123', 10);
        testUser = await User_1.User.create({
            name: 'Test User',
            email: 'test@example.com',
            password: hashedPassword,
        });
        // JWT 토큰 생성
        authToken = jsonwebtoken_1.default.sign({ id: testUser.id, email: testUser.email }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1h' });
    });
    describe('POST /api/users/register', () => {
        it('should register a new user', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/api/users/register')
                .send({
                name: 'New User',
                email: 'new@example.com',
                password: 'password123',
            });
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user).toHaveProperty('email', 'new@example.com');
        });
        it('should not register user with existing email', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/api/users/register')
                .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
            });
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message', '이미 등록된 이메일입니다.');
        });
    });
    describe('POST /api/users/login', () => {
        it('should login with correct credentials', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/api/users/login')
                .send({
                email: 'test@example.com',
                password: 'password123',
            });
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user).toHaveProperty('email', 'test@example.com');
        });
        it('should not login with incorrect password', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .post('/api/users/login')
                .send({
                email: 'test@example.com',
                password: 'wrongpassword',
            });
            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('message', '이메일 또는 비밀번호가 올바르지 않습니다.');
        });
    });
    describe('GET /api/users/profile', () => {
        it('should get user profile with region info', async () => {
            // 테스트용 지역 정보 추가
            await RegionInfo_1.RegionInfo.create({
                type: '법정동',
                code: '1111010100',
                address: '서울특별시 종로구 청운동',
                region1: '서울특별시',
                region2: '종로구',
                region3: '청운동',
                userId: testUser.id,
            });
            const res = await (0, supertest_1.default)(app_1.default)
                .get('/api/users/profile')
                .set('Authorization', `Bearer ${authToken}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('email', 'test@example.com');
            expect(res.body.regionInfos).toHaveLength(1);
        });
    });
    describe('PUT /api/users/profile', () => {
        it('should update user profile', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .put('/api/users/profile')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                name: 'Updated Name',
                profileImage: 'https://example.com/image.jpg',
            });
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', 'Updated Name');
            expect(res.body).toHaveProperty('profileImage', 'https://example.com/image.jpg');
        });
        it('should not allow more than 2 region infos', async () => {
            const res = await (0, supertest_1.default)(app_1.default)
                .put('/api/users/profile')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                regionInfo: [
                    {
                        type: '법정동',
                        code: '1111010100',
                        address: '서울특별시 종로구 청운동',
                        region1: '서울특별시',
                        region2: '종로구',
                        region3: '청운동',
                    },
                    {
                        type: '법정동',
                        code: '4113510300',
                        address: '경기도 성남시 분당구 정자동',
                        region1: '경기도',
                        region2: '성남시 분당구',
                        region3: '정자동',
                    },
                    {
                        type: '법정동',
                        code: '2611051000',
                        address: '부산광역시 해운대구 우동',
                        region1: '부산광역시',
                        region2: '해운대구',
                        region3: '우동',
                    },
                ],
            });
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message', '지역 정보는 최대 2개까지만 등록 가능합니다.');
        });
    });
});
