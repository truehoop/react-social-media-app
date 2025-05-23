"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: async (queryInterface) => {
        // region_infos 테이블 생성
        await queryInterface.createTable('region_infos', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: sequelize_1.DataTypes.INTEGER,
            },
            type: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            code: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            address: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            region1: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            region2: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            region3: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            userId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                // 외래키 제약조건 제거
            },
            createdAt: {
                allowNull: false,
                type: sequelize_1.DataTypes.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: sequelize_1.DataTypes.DATE,
            },
        });
        // users 테이블의 regionInfo 관련 마이그레이션 로직 제거
        // 만약 데이터 이전이 필요하다면, 별도 스크립트로 처리
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable('region_infos');
    },
};
