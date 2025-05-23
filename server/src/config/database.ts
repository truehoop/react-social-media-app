import { Sequelize } from 'sequelize-typescript';
import { Book } from '../models/Book';
import { User } from '../models/User';
import { RegionInfo } from '../models/RegionInfo';
import dotenv from 'dotenv';
import path from 'path';

// 현재 작업 디렉토리 출력
console.log('Current working directory:', process.cwd());

// .env 파일 경로 출력
const envPath = path.resolve(process.cwd(), '.env');
console.log('Loading .env from:', envPath);

// 환경 변수 로드
dotenv.config();

// 데이터베이스 설정
const dbConfig = {
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT || '5432',
  database: process.env.POSTGRES_DB || 'bookswap',
  username: process.env.POSTGRES_USER || 'test',
  password: process.env.POSTGRES_PASSWORD || 'test'
};

// 데이터베이스 설정 로그 (비밀번호는 마스킹)
console.log('Database Config:', {
  ...dbConfig,
  password: '****'
});

// 환경 변수 로드 확인
console.log('Environment variables loaded:', {
  NODE_ENV: process.env.NODE_ENV,
  POSTGRES_HOST: process.env.POSTGRES_HOST,
  POSTGRES_PORT: process.env.POSTGRES_PORT,
  POSTGRES_DB: process.env.POSTGRES_DB,
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_PASSWORD: '****'
});

// Sequelize 인스턴스 생성
export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: dbConfig.host,
  port: parseInt(dbConfig.port),
  database: dbConfig.database,
  username: dbConfig.username,
  password: dbConfig.password,
  models: [User, Book, RegionInfo],
  logging: console.log,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
}); 