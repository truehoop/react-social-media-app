"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const User_1 = require("../models/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../config/auth");
describe('Auth Controller Tests', () => {
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
            // Verify token
            const decoded = jsonwebtoken_1.default.verify(response.body.token, auth_1.JWT_SECRET);
            expect(decoded).toHaveProperty('id');
            expect(decoded).toHaveProperty('email', 'test@example.com');
        });
        it('should return error for existing user with different provider', async () => {
            // Create a user with local provider
            await User_1.User.create({
                name: 'Test User',
                email: 'test@example.com',
                provider: 'local',
                rating: 0
            });
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/google')
                .send(mockGoogleCredential);
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('이미 다른 방식으로 가입된 이메일입니다.');
        });
        it('should return error for invalid credential', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/google')
                .send({ credential: 'invalid-token' });
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Invalid Google credential');
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
            // Verify token
            const decoded = jsonwebtoken_1.default.verify(response.body.token, auth_1.JWT_SECRET);
            expect(decoded).toHaveProperty('id');
            expect(decoded).toHaveProperty('email', 'test@example.com');
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
            // Create a user with local provider
            await User_1.User.create({
                name: 'Test User',
                email: 'test@example.com',
                provider: 'local',
                rating: 0
            });
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/kakao')
                .send(mockKakaoData);
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('이미 다른 방식으로 가입된 이메일입니다.');
        });
        it('should return error for invalid kakao data', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/kakao')
                .send({ kakaoData: {} });
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Invalid Kakao data');
        });
    });
});
