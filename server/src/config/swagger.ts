import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BookSwap API',
      version: '1.0.0',
      description: 'BookSwap API documentation',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [path.join(__dirname, '../routes/*.ts')],
};

const specs = swaggerJsdoc(options);

/**
 * @swagger
 * /api/auth/google:
 *   post:
 *     tags: [Auth]
 *     summary: 구글 소셜 로그인
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - credential
 *             properties:
 *               credential:
 *                 type: string
 *                 description: 구글 OAuth2 credential
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT 토큰
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: 잘못된 요청 또는 이미 다른 방식으로 가입된 이메일
 *       500:
 *         description: 서버 오류
 * 
 * /api/auth/kakao:
 *   post:
 *     tags: [Auth]
 *     summary: 카카오 소셜 로그인
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - kakaoData
 *             properties:
 *               kakaoData:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: 카카오 사용자 ID
 *                   kakao_account:
 *                     type: object
 *                     properties:
 *                       email:
 *                         type: string
 *                       profile:
 *                         type: object
 *                         properties:
 *                           nickname:
 *                             type: string
 *                           profile_image_url:
 *                             type: string
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT 토큰
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: 잘못된 요청, 이메일 미동의, 또는 이미 다른 방식으로 가입된 이메일
 *       500:
 *         description: 서버 오류
 */

export { specs }; 