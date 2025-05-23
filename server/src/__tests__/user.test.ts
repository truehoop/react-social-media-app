import request from 'supertest';
import app from '../app';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/auth';

describe('User Controller Tests', () => {
  let authToken: string;
  let testUser: User;

  beforeEach(async () => {
    // Create a test user
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10),
      rating: 0,
      provider: 'local'
    });

    // Generate auth token
    authToken = jwt.sign(
      { id: testUser.id, email: testUser.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  describe('GET /api/users/me', () => {
    it('should return user profile when authenticated', async () => {
      const response = await request(app)
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
      const response = await request(app)
        .get('/api/users/me');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Authentication required');
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid token');
    });
  });

  describe('PUT /api/users/me', () => {
    it('should update user profile when authenticated', async () => {
      const updateData = {
        name: 'Updated Name',
        password: 'newpassword123'
      };

      const response = await request(app)
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
      const updatedUser = await User.findByPk(testUser.id);
      const isPasswordValid = await bcrypt.compare(updateData.password, updatedUser!.password ?? '');
      expect(isPasswordValid).toBe(true);
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .put('/api/users/me')
        .send({ name: 'New Name' });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Authentication required');
    });

    it('should return 400 for invalid update data', async () => {
      const response = await request(app)
        .put('/api/users/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ email: 'invalid-email' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid update data');
    });
  });

  describe('DELETE /api/users/me', () => {
    it('should delete user account when authenticated', async () => {
      const response = await request(app)
        .delete('/api/users/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User account deleted successfully');

      // Verify user was deleted
      const deletedUser = await User.findByPk(testUser.id);
      expect(deletedUser).toBeNull();
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .delete('/api/users/me');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Authentication required');
    });
  });
}); 