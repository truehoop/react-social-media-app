"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookController_1 = require("../controllers/bookController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - image
 *         - genres
 *         - condition
 *         - status
 *         - registeredDate
 *         - geolocation
 *         - regionInfo
 *       properties:
 *         id:
 *           type: integer
 *           description: 도서 ID
 *         title:
 *           type: string
 *           description: 도서 제목
 *         image:
 *           type: string
 *           description: 도서 이미지 URL
 *         genres:
 *           type: array
 *           items:
 *             type: string
 *           description: 도서 장르 목록
 *         condition:
 *           type: string
 *           enum: [최상, 상, 중, 하]
 *           description: 도서 상태
 *         status:
 *           type: string
 *           enum: [교환가능, 교환예약, 교환완료]
 *           description: 교환 상태
 *         registeredDate:
 *           type: string
 *           format: date-time
 *           description: 등록일
 *         geolocation:
 *           type: object
 *           properties:
 *             lat:
 *               type: number
 *               description: 위도
 *             lng:
 *               type: number
 *               description: 경도
 *         regionInfo:
 *           type: object
 *           properties:
 *             regionType:
 *               type: string
 *               description: 지역 타입
 *             code:
 *               type: string
 *               description: 지역 코드
 *             addressName:
 *               type: string
 *               description: 전체 주소
 *             region1:
 *               type: string
 *               description: 시/도
 *             region2:
 *               type: string
 *               description: 구/군
 *             region3:
 *               type: string
 *               description: 동/읍/면
 *         owner:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: 소유자 ID
 *             name:
 *               type: string
 *               description: 소유자 이름
 */
/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: 도서 검색 및 조회
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: genres
 *         schema:
 *           type: string
 *         description: "장르 (예: 소설+판타지)"
 *       - in: query
 *         name: condition
 *         schema:
 *           type: string
 *           enum: [최상, 상, 중, 하]
 *         description: 도서 상태
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [교환가능, 교환예약, 교환완료]
 *         description: 교환 상태
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *         description: 현재 위치 위도
 *       - in: query
 *         name: lng
 *         schema:
 *           type: number
 *         description: 현재 위치 경도
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *           default: 5
 *         description: 검색 반경 (km)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [date, distance]
 *           default: date
 *         description: "정렬 기준 (date: 등록순, distance: 거리순)"
 *     responses:
 *       200:
 *         description: 검색된 도서 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
router.get('/', bookController_1.getBooks);
/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: 새 도서 등록
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       201:
 *         description: 등록된 도서 정보
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware_1.authMiddleware, bookController_1.createBook);
/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: 특정 도서 조회
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 도서 ID
 *     responses:
 *       200:
 *         description: 도서 정보
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: 도서를 찾을 수 없음
 */
router.get('/:id', bookController_1.getBookById);
/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: 도서 정보 수정
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 도서 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: 수정된 도서 정보
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 도서를 찾을 수 없음
 *       401:
 *         description: Unauthorized
 */
router.put('/:id', authMiddleware_1.authMiddleware, bookController_1.updateBook);
/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: 도서 삭제
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 도서 ID
 *     responses:
 *       200:
 *         description: 도서가 삭제되었습니다
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 도서를 찾을 수 없음
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', authMiddleware_1.authMiddleware, bookController_1.deleteBook);
exports.default = router;
