"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.specs = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const path_1 = __importDefault(require("path"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'BookSwap API',
            version: '1.0.0',
            description: 'BookSwap API documentation',
        },
        servers: [
            {
                url: 'http://localhost:3001',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: [path_1.default.join(__dirname, '../routes/*.ts')],
};
const specs = (0, swagger_jsdoc_1.default)(options);
exports.specs = specs;
