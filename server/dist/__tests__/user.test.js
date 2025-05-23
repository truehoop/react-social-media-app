"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const User_1 = require("../models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../config/auth");
describe('User Controller Tests', () => {
    let authToken;
    let testUser;
    beforeEach(async () => {
        // Create a test user
        testUser = await User_1.User.create({
            name: 'Test User',
            email: 'test@example.com',
            password: await bcryptjs_1.default.hash('password123', 10),
            rating: 0,
            provider: 'local'
        });
        // Generate auth token
        authToken = jsonwebtoken_1.default.sign({ id: testUser.id, email: testUser.email }, auth_1.JWT_SECRET, { expiresIn: '1h' });
    });
    describe('GET /api/users/me', () => {
        it('should return user profile when authenticated', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .get('/api/users/me')
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({
                id: testUser.id,
                name: testUser.name,
                email: testUser.email,
                provider: testUser.provider
            });
        });
        it('should return 401 when not authenticated', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .get('/api/users/me');
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Authentication required');
        });
        it('should return 401 with invalid token', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .get('/api/users/me')
                .set('Authorization', 'Bearer invalid-token');
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Invalid token');
        });
    });
    describe('PUT /api/users/me', () => {
        it('should update user profile when authenticated', async () => {
            var _a;
            const updateData = {
                name: 'Updated Name',
                password: 'newpassword123'
            };
            const response = await (0, supertest_1.default)(app_1.default)
                .put('/api/users/me')
                .set('Authorization', `Bearer ${authToken}`)
                .send(updateData);
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({
                id: testUser.id,
                name: updateData.name,
                email: testUser.email
            });
            // Verify password was updated
            const updatedUser = await User_1.User.findByPk(testUser.id);
            const isPasswordValid = await bcryptjs_1.default.compare(updateData.password, (_a = updatedUser.password) !== null && _a !== void 0 ? _a : '');
            expect(isPasswordValid).toBe(true);
        });
        it('should return 401 when not authenticated', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .put('/api/users/me')
                .send({ name: 'New Name' });
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Authentication required');
        });
        it('should return 400 for invalid update data', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .put('/api/users/me')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ email: 'invalid-email' });
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Invalid update data');
        });
    });
    describe('DELETE /api/users/me', () => {
        it('should delete user account when authenticated', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .delete('/api/users/me')
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('User account deleted successfully');
            // Verify user was deleted
            const deletedUser = await User_1.User.findByPk(testUser.id);
            expect(deletedUser).toBeNull();
        });
        it('should return 401 when not authenticated', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .delete('/api/users/me');
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Authentication required');
        });
    });
});
