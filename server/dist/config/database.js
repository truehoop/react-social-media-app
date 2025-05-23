"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Book_1 = require("../models/Book");
const User_1 = require("../models/User");
const RegionInfo_1 = require("../models/RegionInfo");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// 현재 작업 디렉토리 출력
console.log('Current working directory:', process.cwd());
// .env 파일 경로 출력
const envPath = path_1.default.resolve(process.cwd(), '.env');
console.log('Loading .env from:', envPath);
// 환경 변수 로드
dotenv_1.default.config();
// 데이터베이스 설정
const dbConfig = {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || '5432',
    database: process.env.POSTGRES_DB || 'bookswap',
    username: process.env.POSTGRES_USER || 'test',
    password: process.env.POSTGRES_PASSWORD || 'test'
};
// 데이터베이스 설정 로그 (비밀번호는 마스킹)
console.log('Database Config:', Object.assign(Object.assign({}, dbConfig), { password: '****' }));
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
exports.sequelize = new sequelize_typescript_1.Sequelize({
    dialect: 'postgres',
    host: dbConfig.host,
    port: parseInt(dbConfig.port),
    database: dbConfig.database,
    username: dbConfig.username,
    password: dbConfig.password,
    models: [User_1.User, Book_1.Book, RegionInfo_1.RegionInfo],
    logging: console.log,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});
