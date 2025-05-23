"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
beforeAll(async () => {
    try {
        await database_1.sequelize.authenticate();
        console.log('Database connection established for tests');
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error;
    }
});
afterAll(async () => {
    try {
        await database_1.sequelize.close();
        console.log('Database connection closed');
    }
    catch (error) {
        console.error('Error closing database connection:', error);
    }
});
// 각 테스트 후에 모든 테이블의 데이터를 삭제
afterEach(async () => {
    try {
        await database_1.sequelize.truncate({ cascade: true });
    }
    catch (error) {
        console.error('Error cleaning up database:', error);
    }
});
