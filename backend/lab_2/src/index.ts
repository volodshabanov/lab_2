import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { userRouter } from './controllers/user.controller.js';
import { passRouter } from './controllers/pass.controller.js';
import { reasonRouter } from './controllers/reason.controller.js';
import { logRouter } from './controllers/log.controller.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './middleware/logger.js';
import { setupSwagger } from './swagger.js';

const app = express();
const PORT: number = 3000;

// --- ЗАХИСТ ---
app.use(helmet());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { status: 'error', statusCode: 429, message: 'Забагато запитів. Спробуй пізніше.' },
});
app.use(limiter);

// --- ОСНОВНІ MIDDLEWARE ---
app.use(express.json());
app.use(logger);

// --- SWAGGER ---
setupSwagger(app);

// --- РОУТЕРИ ---
app.use('/api/users', userRouter);
app.use('/api/passes', passRouter);
app.use('/api/reasons', reasonRouter);
app.use('/api/logs', logRouter);

// --- ERROR HANDLER ---
app.use(errorHandler);

app.listen(PORT, (): void => {
    console.log(`Сервер запущено на http://localhost:${PORT}`);
});