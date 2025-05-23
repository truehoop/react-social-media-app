"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const User_1 = require("../models/User");
describe('Auth Controller Tests', () => {
    beforeEach(async () => {
        // 테스트 전 데이터베이스 초기화
        await User_1.User.destroy({ where: {} });
    });
    describe('POST /api/auth/google', () => {
        const mockGoogleCredential = {
            credential: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRlc3QgVXNlciIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsInBpY3R1cmUiOiJodHRwczovL2V4YW1wbGUuY29tL3Byb2ZpbGUuanBnIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
        };
        it('should create a new user and return token for first-time Google login', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/google')
                .send(mockGoogleCredential);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(response.body.user).toMatchObject({
                email: 'test@example.com',
                name: 'Test User',
                provider: 'google'
            });
            // 데이터베이스에 사용자가 생성되었는지 확인
            const user = await User_1.User.findOne({ where: { email: 'test@example.com' } });
            expect(user).toBeTruthy();
            expect(user === null || user === void 0 ? void 0 : user.provider).toBe('google');
        });
        it('should return error for existing user with different provider', async () => {
            // 먼저 다른 provider로 사용자 생성
            await User_1.User.create({
                id: 'local123',
                email: 'test@example.com',
                name: 'Test User',
                provider: 'local',
                rating: 0
            });
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/google')
                .send(mockGoogleCredential);
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('이미 다른 방식으로 가입된 이메일입니다.');
        });
    });
    describe('POST /api/auth/kakao', () => {
        const mockKakaoData = {
            kakaoData: {
                id: '123456789',
                kakao_account: {
                    email: 'test@example.com',
                    profile: {
                        nickname: 'Test User',
                        profile_image_url: 'https://example.com/profile.jpg'
                    }
                }
            }
        };
        it('should create a new user and return token for first-time Kakao login', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/kakao')
                .send(mockKakaoData);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(response.body.user).toMatchObject({
                email: 'test@example.com',
                name: 'Test User',
                provider: 'kakao'
            });
            // 데이터베이스에 사용자가 생성되었는지 확인
            const user = await User_1.User.findOne({ where: { email: 'test@example.com' } });
            expect(user).toBeTruthy();
            expect(user === null || user === void 0 ? void 0 : user.provider).toBe('kakao');
        });
        it('should return error when email is not provided', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/kakao')
                .send({
                kakaoData: {
                    id: '123456789',
                    kakao_account: {
                        profile: {
                            nickname: 'Test User',
                            profile_image_url: 'https://example.com/profile.jpg'
                        }
                    }
                }
            });
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('이메일 정보 제공에 동의해주세요.');
        });
        it('should return error for existing user with different provider', async () => {
            // 먼저 다른 provider로 사용자 생성
            await User_1.User.create({
                id: 'local123',
                email: 'test@example.com',
                name: 'Test User',
                provider: 'local',
                rating: 0
            });
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/kakao')
                .send(mockKakaoData);
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('이미 다른 방식으로 가입된 이메일입니다.');
        });
    });
});
