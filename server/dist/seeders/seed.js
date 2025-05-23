"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/User");
const Book_1 = require("../models/Book");
const RegionInfo_1 = require("../models/RegionInfo");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("../config/database");
const sampleRegions = [
    {
        type: 'H',
        code: '1111010100',
        address: '서울특별시 종로구 청운동',
        region1: '서울특별시',
        region2: '종로구',
        region3: '청운동',
    },
    {
        type: 'H',
        code: '4113510300',
        address: '경기도 성남시 분당구 정자동',
        region1: '경기도',
        region2: '성남시 분당구',
        region3: '정자동',
    },
    {
        type: 'H',
        code: '2611051000',
        address: '부산광역시 해운대구 우동',
        region1: '부산광역시',
        region2: '해운대구',
        region3: '우동',
    },
    {
        type: 'H',
        code: '3017010100',
        address: '대전광역시 유성구 봉명동',
        region1: '대전광역시',
        region2: '유성구',
        region3: '봉명동',
    },
    {
        type: 'H',
        code: '2714010100',
        address: '대구광역시 수성구 범어동',
        region1: '대구광역시',
        region2: '수성구',
        region3: '범어동',
    },
];
const seedData = async () => {
    try {
        // 데이터베이스 연결 확인
        await database_1.sequelize.authenticate();
        console.log('Database connection has been established successfully.');
        // 기존 데이터 삭제
        await Book_1.Book.destroy({ where: {} });
        await RegionInfo_1.RegionInfo.destroy({ where: {} });
        await User_1.User.destroy({ where: {} });
        console.log('Existing data has been cleared.');
        // 테스트용 유저 생성
        const testUser1 = await User_1.User.create({
            name: 'Test User',
            email: 'test@example.com',
            password: await bcryptjs_1.default.hash('password123', 10),
            rating: 0,
            provider: 'local'
        });
        const testUser2 = await User_1.User.create({
            name: 'Test User 2',
            email: 'test2@example.com',
            password: await bcryptjs_1.default.hash('password123', 10),
            rating: 0,
            provider: 'local'
        });
        // 일반 유저 생성
        const users = await User_1.User.bulkCreate([
            {
                name: '홍길동',
                email: 'hong@example.com',
                password: await bcryptjs_1.default.hash('password123', 10),
                rating: 0,
                provider: 'local'
            },
            {
                name: '김철수',
                email: 'kim@example.com',
                password: await bcryptjs_1.default.hash('password123', 10),
                rating: 0,
                provider: 'local'
            },
            {
                name: '이영희',
                email: 'lee@example.com',
                password: await bcryptjs_1.default.hash('password123', 10),
                rating: 0,
                provider: 'local'
            },
            {
                name: '이한상',
                email: 'user@example.com',
                password: await bcryptjs_1.default.hash('string', 10),
                rating: 0,
                provider: 'local'
            }
        ]);
        // region_infos 생성 (테스트 유저)
        for (const user of [testUser1, testUser2]) {
            const selectedRegions = sampleRegions
                .sort(() => Math.random() - 0.5)
                .slice(0, 2);
            await RegionInfo_1.RegionInfo.bulkCreate(selectedRegions.map(region => (Object.assign(Object.assign({}, region), { userId: user.id, createdAt: new Date(), updatedAt: new Date() }))));
        }
        // region_infos 생성 (일반 유저)
        for (const user of users) {
            const selectedRegions = sampleRegions
                .sort(() => Math.random() - 0.5)
                .slice(0, 2);
            await RegionInfo_1.RegionInfo.bulkCreate(selectedRegions.map(region => (Object.assign(Object.assign({}, region), { userId: user.id, createdAt: new Date(), updatedAt: new Date() }))));
        }
        // Book 생성 (테스트 유저)
        await Book_1.Book.bulkCreate([
            {
                title: 'Test Book 1',
                image: 'https://example.com/test1.jpg',
                genres: ['테스트', '소설'],
                condition: '최상',
                status: '교환가능',
                registeredDate: new Date(),
                geolocation: { lat: 37.5665, lng: 126.9780 },
                regionInfo: [{
                        type: 'H',
                        code: sampleRegions[0].code,
                        address: sampleRegions[0].address,
                        region1: sampleRegions[0].region1,
                        region2: sampleRegions[0].region2,
                        region3: sampleRegions[0].region3,
                    }],
                ownerId: testUser1.id,
            },
            {
                title: 'Test Book 2',
                image: 'https://example.com/test2.jpg',
                genres: ['테스트', 'SF'],
                condition: '상',
                status: '교환가능',
                registeredDate: new Date(),
                geolocation: { lat: 37.5665, lng: 126.9780 },
                regionInfo: [{
                        type: 'H',
                        code: sampleRegions[1].code,
                        address: sampleRegions[1].address,
                        region1: sampleRegions[1].region1,
                        region2: sampleRegions[1].region2,
                        region3: sampleRegions[1].region3,
                    }],
                ownerId: testUser2.id,
            }
        ]);
        // Book 생성 (일반 유저)
        await Book_1.Book.bulkCreate([
            {
                title: '해리포터와 마법사의 돌',
                image: 'https://example.com/harry-potter.jpg',
                genres: ['판타지', '어린이'],
                condition: '최상',
                status: '교환가능',
                registeredDate: new Date(),
                geolocation: { lat: 37.5665, lng: 126.9780 },
                regionInfo: [{
                        type: 'H',
                        code: sampleRegions[0].code,
                        address: sampleRegions[0].address,
                        region1: sampleRegions[0].region1,
                        region2: sampleRegions[0].region2,
                        region3: sampleRegions[0].region3,
                    }],
                ownerId: users[0].id,
            },
            {
                title: '1984',
                image: 'https://example.com/1984.jpg',
                genres: ['SF', '디스토피아'],
                condition: '상',
                status: '교환가능',
                registeredDate: new Date(),
                geolocation: { lat: 37.5665, lng: 126.9780 },
                regionInfo: [{
                        type: 'H',
                        code: sampleRegions[1].code,
                        address: sampleRegions[1].address,
                        region1: sampleRegions[1].region1,
                        region2: sampleRegions[1].region2,
                        region3: sampleRegions[1].region3,
                    }],
                ownerId: users[1].id,
            },
            {
                title: '어린 왕자',
                image: 'https://example.com/little-prince.jpg',
                genres: ['소설', '철학'],
                condition: '중',
                status: '교환예약',
                registeredDate: new Date(),
                geolocation: { lat: 37.5665, lng: 126.9780 },
                regionInfo: [{
                        type: 'H',
                        code: sampleRegions[2].code,
                        address: sampleRegions[2].address,
                        region1: sampleRegions[2].region1,
                        region2: sampleRegions[2].region2,
                        region3: sampleRegions[2].region3,
                    }],
                ownerId: users[2].id,
            },
            {
                title: '죄와 벌',
                image: 'https://example.com/crime-and-punishment.jpg',
                genres: ['소설', '고전'],
                condition: '하',
                status: '교환완료',
                registeredDate: new Date(),
                geolocation: { lat: 37.5665, lng: 126.9780 },
                regionInfo: [{
                        type: 'H',
                        code: sampleRegions[3].code,
                        address: sampleRegions[3].address,
                        region1: sampleRegions[3].region1,
                        region2: sampleRegions[3].region2,
                        region3: sampleRegions[3].region3,
                    }],
                ownerId: users[3].id,
            },
        ]);
        console.log('Sample data has been seeded successfully!');
    }
    catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};
// 실행
if (require.main === module) {
    seedData()
        .then(() => {
        console.log('Seeding completed successfully.');
        process.exit(0);
    })
        .catch((error) => {
        console.error('Seeding failed:', error);
        process.exit(1);
    });
}
exports.default = seedData;
