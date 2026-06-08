import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Lab 2 API',
            version: '1.0.0',
            description: 'REST API для управління пропусками студентів',
        },
        components: {
            schemas: {
                // --- USER ---
                CreateUserRequest: {
                    type: 'object',
                    required: ['username', 'email', 'role'],
                    properties: {
                        username: { type: 'string', minLength: 4, maxLength: 35, example: 'denis_tk' },
                        email: { type: 'string', format: 'email', example: 'denis@gmail.com' },
                        role: { type: 'string', enum: ['admin', 'student', 'teacher'], example: 'student' },
                    },
                },
                UpdateUserRequest: {
                    type: 'object',
                    properties: {
                        username: { type: 'string', minLength: 4, maxLength: 35 },
                        email: { type: 'string', format: 'email' },
                        role: { type: 'string', enum: ['admin', 'student', 'teacher'] },
                    },
                },
                UserResponse: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        username: { type: 'string' },
                        email: { type: 'string' },
                        role: { type: 'string', enum: ['admin', 'student', 'teacher'] },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },

                // --- REASON ---
                CreateReasonRequest: {
                    type: 'object',
                    required: ['name', 'description'],
                    properties: {
                        name: { type: 'string', minLength: 2, maxLength: 50, example: 'LabWork' },
                        description: { type: 'string', minLength: 5, maxLength: 200, example: 'Лабораторна робота' },
                    },
                },
                UpdateReasonRequest: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', minLength: 2, maxLength: 50 },
                        description: { type: 'string', minLength: 5, maxLength: 200 },
                    },
                },
                ReasonResponse: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        name: { type: 'string' },
                        description: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },

                // --- PASS ---
                CreatePassRequest: {
                    type: 'object',
                    required: ['userId', 'userPHD', 'userName', 'reasonId', 'validDate', 'issuer'],
                    properties: {
                        userId: { type: 'string', format: 'uuid' },
                        userPHD: { type: 'string', enum: ['Baclvr', 'Magistr'] },
                        userName: { type: 'string', minLength: 4, maxLength: 35, example: 'Денис Ткачук' },
                        reasonId: { type: 'string', format: 'uuid' },
                        validDate: { type: 'string', format: 'date', example: '2025-06-01' },
                        issuer: { type: 'string', minLength: 2, example: 'Деканат' },
                        comment: { type: 'string', example: 'Здача лабораторної' },
                    },
                },
                UpdatePassRequest: {
                    type: 'object',
                    properties: {
                        userPHD: { type: 'string', enum: ['Baclvr', 'Magistr'] },
                        userName: { type: 'string', minLength: 4, maxLength: 35 },
                        reasonId: { type: 'string', format: 'uuid' },
                        validDate: { type: 'string', format: 'date' },
                        issuer: { type: 'string' },
                        comment: { type: 'string' },
                    },
                },
                PassResponse: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        userId: { type: 'string', format: 'uuid' },
                        userPHD: { type: 'string', enum: ['Baclvr', 'Magistr'] },
                        userName: { type: 'string' },
                        reasonId: { type: 'string', format: 'uuid' },
                        reason: { type: 'string' },
                        validDate: { type: 'string' },
                        issuer: { type: 'string' },
                        comment: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },

                // --- LOG ---
                LogResponse: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        method: { type: 'string', example: 'GET' },
                        path: { type: 'string', example: '/api/users' },
                        statusCode: { type: 'number', example: 200 },
                        duration: { type: 'number', example: 12 },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },

                // --- PAGINATED ---
                PaginatedUsers: {
                    type: 'object',
                    properties: {
                        data: { type: 'array', items: { $ref: '#/components/schemas/UserResponse' } },
                        total: { type: 'number' },
                        page: { type: 'number' },
                        pageSize: { type: 'number' },
                        totalPages: { type: 'number' },
                    },
                },
                PaginatedPasses: {
                    type: 'object',
                    properties: {
                        data: { type: 'array', items: { $ref: '#/components/schemas/PassResponse' } },
                        total: { type: 'number' },
                        page: { type: 'number' },
                        pageSize: { type: 'number' },
                        totalPages: { type: 'number' },
                    },
                },

                // --- ERROR ---
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'error' },
                        statusCode: { type: 'number', example: 400 },
                        message: { type: 'string', example: 'Помилка валідації' },
                        details: { type: 'array', items: { type: 'string' } },
                    },
                },
            },
        },
        paths: {
            // ===================== USERS =====================
            '/api/users': {
                get: {
                    tags: ['Users'],
                    summary: 'Отримати список користувачів',
                    parameters: [
                        { name: 'role', in: 'query', schema: { type: 'string', enum: ['admin', 'student', 'teacher'] } },
                        { name: 'sortBy', in: 'query', schema: { type: 'string', enum: ['username', 'createdAt'] } },
                        { name: 'order', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'] } },
                        { name: 'page', in: 'query', schema: { type: 'string', example: '1' } },
                        { name: 'pageSize', in: 'query', schema: { type: 'string', example: '10' } },
                    ],
                    responses: {
                        200: { description: 'Список користувачів', content: { 'application/json': { schema: { $ref: '#/components/schemas/PaginatedUsers' } } } },
                    },
                },
                post: {
                    tags: ['Users'],
                    summary: 'Створити користувача',
                    requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateUserRequest' } } } },
                    responses: {
                        201: { description: 'Створено', content: { 'application/json': { schema: { $ref: '#/components/schemas/UserResponse' } } } },
                        400: { description: 'Помилка валідації', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    },
                },
            },
            '/api/users/{id}': {
                get: {
                    tags: ['Users'],
                    summary: 'Отримати користувача за ID',
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
                    responses: {
                        200: { description: 'Користувач', content: { 'application/json': { schema: { $ref: '#/components/schemas/UserResponse' } } } },
                        404: { description: 'Не знайдено', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    },
                },
                put: {
                    tags: ['Users'],
                    summary: 'Оновити користувача',
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
                    requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateUserRequest' } } } },
                    responses: {
                        200: { description: 'Оновлено', content: { 'application/json': { schema: { $ref: '#/components/schemas/UserResponse' } } } },
                        404: { description: 'Не знайдено', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    },
                },
                delete: {
                    tags: ['Users'],
                    summary: 'Видалити користувача',
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
                    responses: {
                        204: { description: 'Видалено' },
                        404: { description: 'Не знайдено', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    },
                },
            },

            // ===================== REASONS =====================
            '/api/reasons': {
                get: {
                    tags: ['Reasons'],
                    summary: 'Отримати всі причини',
                    responses: {
                        200: { description: 'Список причин', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/ReasonResponse' } } } } },
                    },
                },
                post: {
                    tags: ['Reasons'],
                    summary: 'Створити причину',
                    requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateReasonRequest' } } } },
                    responses: {
                        201: { description: 'Створено', content: { 'application/json': { schema: { $ref: '#/components/schemas/ReasonResponse' } } } },
                        400: { description: 'Помилка валідації', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    },
                },
            },
            '/api/reasons/{id}': {
                get: {
                    tags: ['Reasons'],
                    summary: 'Отримати причину за ID',
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
                    responses: {
                        200: { description: 'Причина', content: { 'application/json': { schema: { $ref: '#/components/schemas/ReasonResponse' } } } },
                        404: { description: 'Не знайдено', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    },
                },
                put: {
                    tags: ['Reasons'],
                    summary: 'Оновити причину',
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
                    requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateReasonRequest' } } } },
                    responses: {
                        200: { description: 'Оновлено', content: { 'application/json': { schema: { $ref: '#/components/schemas/ReasonResponse' } } } },
                        404: { description: 'Не знайдено', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    },
                },
                delete: {
                    tags: ['Reasons'],
                    summary: 'Видалити причину',
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
                    responses: {
                        204: { description: 'Видалено' },
                        404: { description: 'Не знайдено', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    },
                },
            },

            // ===================== PASSES =====================
            '/api/passes': {
                get: {
                    tags: ['Passes'],
                    summary: 'Отримати список пропусків',
                    parameters: [
                        { name: 'reasonId', in: 'query', schema: { type: 'string' } },
                        { name: 'userId', in: 'query', schema: { type: 'string' } },
                        { name: 'sortBy', in: 'query', schema: { type: 'string', enum: ['validDate', 'createdAt', 'userName'] } },
                        { name: 'order', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'] } },
                        { name: 'page', in: 'query', schema: { type: 'string' } },
                        { name: 'pageSize', in: 'query', schema: { type: 'string' } },
                    ],
                    responses: {
                        200: { description: 'Список пропусків', content: { 'application/json': { schema: { $ref: '#/components/schemas/PaginatedPasses' } } } },
                    },
                },
                post: {
                    tags: ['Passes'],
                    summary: 'Створити пропуск',
                    requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreatePassRequest' } } } },
                    responses: {
                        201: { description: 'Створено', content: { 'application/json': { schema: { $ref: '#/components/schemas/PassResponse' } } } },
                        400: { description: 'Помилка валідації', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    },
                },
            },
            '/api/passes/{id}': {
                get: {
                    tags: ['Passes'],
                    summary: 'Отримати пропуск за ID',
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
                    responses: {
                        200: { description: 'Пропуск', content: { 'application/json': { schema: { $ref: '#/components/schemas/PassResponse' } } } },
                        404: { description: 'Не знайдено', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    },
                },
                put: {
                    tags: ['Passes'],
                    summary: 'Оновити пропуск',
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
                    requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdatePassRequest' } } } },
                    responses: {
                        200: { description: 'Оновлено', content: { 'application/json': { schema: { $ref: '#/components/schemas/PassResponse' } } } },
                        404: { description: 'Не знайдено', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    },
                },
                delete: {
                    tags: ['Passes'],
                    summary: 'Видалити пропуск',
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
                    responses: {
                        204: { description: 'Видалено' },
                        404: { description: 'Не знайдено', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
                    },
                },
            },

            // ===================== LOGS =====================
            '/api/logs': {
                get: {
                    tags: ['Logs'],
                    summary: 'Отримати всі логи запитів',
                    responses: {
                        200: { description: 'Список логів', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/LogResponse' } } } } },
                    },
                },
            },
        },
    },
    apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express): void {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log('Swagger UI: http://localhost:3000/api-docs');
}