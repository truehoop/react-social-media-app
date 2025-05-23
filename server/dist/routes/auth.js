"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
// 소셜 로그인 라우트
router.post('/google', authController_1.googleLogin);
router.post('/kakao', authController_1.kakaoLogin);
exports.default = router;
