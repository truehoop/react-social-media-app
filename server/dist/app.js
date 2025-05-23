"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./config/swagger");
const bookRoutes_1 = __importDefault(require("./routes/bookRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const auth_1 = __importDefault(require("./routes/auth"));
const database_1 = require("./config/database");
const seed_1 = __importDefault(require("./seeders/seed"));
// 환경 변수 설정
dotenv_1.default.config();
const app = (0, express_1.default)();
// 미들웨어 설정
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Swagger UI 설정
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.specs));
// 데이터베이스 연결 및 동기화
database_1.sequelize
    .authenticate()
    .then(() => {
    console.log('Connected to PostgreSQL');
    return database_1.sequelize.sync({ alter: true }); // 기존 테이블이 있으면 스키마를 업데이트
})
    .then(() => {
    console.log('Database synchronized');
    // 샘플 데이터 삽입
    return (0, seed_1.default)();
})
    .then(() => {
    console.log('Sample data initialized');
})
    .catch((error) => {
    console.error('Database connection error:', error);
});
// 라우트 설정
app.use('/api/books', bookRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/auth', auth_1.default);
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to BookSwap API' });
});
// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});
exports.default = app;
