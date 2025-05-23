import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';
import bookRoutes from './routes/bookRoutes';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/auth';
import { sequelize } from './config/database';
import seedData from './seeders/seed';

// 환경 변수 설정
dotenv.config();

const app = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI 설정
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// 데이터베이스 연결 및 동기화
sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to PostgreSQL');
    return sequelize.sync({ alter: true }); // 기존 테이블이 있으면 스키마를 업데이트
  })
  .then(() => {
    console.log('Database synchronized');
    // 샘플 데이터 삽입
    return seedData();
  })
  .then(() => {
    console.log('Sample data initialized');
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });

// 라우트 설정
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to BookSwap API' });
});

// 에러 핸들링 미들웨어
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

export default app; 