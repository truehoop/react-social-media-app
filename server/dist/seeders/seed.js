"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/User");
const Book_1 = require("../models/Book");
const RegionInfo_1 = require("../models/RegionInfo");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const sampleRegions = [
    {
        type: '법정동',
        code: '1111010100',
        address: '서울특별시 종로구 청운동',
        region1: '서울특별시',
        region2: '종로구',
        region3: '청운동',
    },
    {
        type: '법정동',
        code: '4113510300',
        address: '경기도 성남시 분당구 정자동',
        region1: '경기도',
        region2: '성남시 분당구',
        region3: '정자동',
    },
    {
        type: '법정동',
        code: '2611051000',
        address: '부산광역시 해운대구 우동',
        region1: '부산광역시',
        region2: '해운대구',
        region3: '우동',
    },
    {
        type: '법정동',
        code: '3017010100',
        address: '대전광역시 유성구 봉명동',
        region1: '대전광역시',
        region2: '유성구',
        region3: '봉명동',
    },
    {
        type: '법정동',
        code: '2714010100',
        address: '대구광역시 수성구 범어동',
        region1: '대구광역시',
        region2: '수성구',
        region3: '범어동',
    },
];
const seedData = async () => {
    try {
        // Create sample users
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
            }
        ]);
        // Create sample books
        await Book_1.Book.bulkCreate([
            {
                title: '해리포터와 마법사의 돌',
                image: 'https://example.com/harry-potter.jpg',
                genres: ['판타지', '어린이'],
                condition: '최상',
                status: '교환가능',
                registeredDate: new Date(),
                geolocation: {
                    lat: 37.5665,
                    lng: 126.9780,
                },
                regionInfo: [
                    {
                        regionType: 'H',
                        code: '1100000000',
                        addressName: '서울특별시',
                        region1: '서울특별시',
                        region2: '',
                        region3: '',
                    },
                ],
                ownerId: users[0].id,
            },
            {
                title: '1984',
                image: 'https://example.com/1984.jpg',
                genres: ['SF', '디스토피아'],
                condition: '상',
                status: '교환가능',
                registeredDate: new Date(),
                geolocation: {
                    lat: 37.5665,
                    lng: 126.9780,
                },
                regionInfo: [
                    {
                        regionType: 'H',
                        code: '1100000000',
                        addressName: '서울특별시',
                        region1: '서울특별시',
                        region2: '',
                        region3: '',
                    },
                ],
                ownerId: users[1].id,
            },
            {
                title: '어린 왕자',
                image: 'https://example.com/little-prince.jpg',
                genres: ['소설', '철학'],
                condition: '중',
                status: '교환예약',
                registeredDate: new Date(),
                geolocation: {
                    lat: 37.5665,
                    lng: 126.9780,
                },
                regionInfo: [
                    {
                        regionType: 'H',
                        code: '1100000000',
                        addressName: '서울특별시',
                        region1: '서울특별시',
                        region2: '',
                        region3: '',
                    },
                ],
                ownerId: users[2].id,
            },
            {
                title: '죄와 벌',
                image: 'https://example.com/crime-and-punishment.jpg',
                genres: ['소설', '고전'],
                condition: '하',
                status: '교환완료',
                registeredDate: new Date(),
                geolocation: {
                    lat: 37.5665,
                    lng: 126.9780,
                },
                regionInfo: [
                    {
                        regionType: 'H',
                        code: '1100000000',
                        addressName: '서울특별시',
                        region1: '서울특별시',
                        region2: '',
                        region3: '',
                    },
                ],
                ownerId: users[0].id,
            },
        ]);
        // Create region_infos for each user
        for (const user of users) {
            // Skip if user already has 2 or more region_infos
            const existingRegionInfos = await RegionInfo_1.RegionInfo.count({
                where: { userId: user.id }
            });
            if (existingRegionInfos >= 2)
                continue;
            // Randomly select 2 regions for this user
            const selectedRegions = sampleRegions
                .sort(() => Math.random() - 0.5)
                .slice(0, 2);
            // Create region_infos
            await RegionInfo_1.RegionInfo.bulkCreate(selectedRegions.map(region => (Object.assign(Object.assign({}, region), { userId: user.id, createdAt: new Date(), updatedAt: new Date() }))));
        }
        console.log('Sample data has been seeded successfully!');
    }
    catch (error) {
        console.error('Error seeding data:', error);
    }
};
exports.default = seedData;
