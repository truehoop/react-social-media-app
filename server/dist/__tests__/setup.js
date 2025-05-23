"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const seed_1 = __importDefault(require("../seeders/seed"));
beforeAll(async () => {
    try {
        // 데이터베이스 연결 확인
        await database_1.sequelize.authenticate();
        console.log('Database connection established for tests');
        // 테이블 동기화 (force: true로 모든 테이블 재생성)
        await database_1.sequelize.sync({ force: true });
        // 시드 데이터 삽입
        await (0, seed_1.default)();
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error;
    }
});
afterAll(async () => {
    try {
        // 모든 테이블 삭제
        await database_1.sequelize.drop();
        // 데이터베이스 연결 종료
        await database_1.sequelize.close();
        console.log('Database connection closed');
    }
    catch (error) {
        console.error('Error closing database connection:', error);
    }
});
// 각 테스트 전에 데이터베이스 초기화
beforeEach(async () => {
    try {
        // 모든 테이블의 데이터 삭제
        await database_1.sequelize.truncate({ cascade: true });
        // 시드 데이터 다시 삽입
        await (0, seed_1.default)();
    }
    catch (error) {
        console.error('Error resetting database:', error);
    }
});
