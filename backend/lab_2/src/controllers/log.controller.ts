import { Router, Request, Response } from 'express';
import { logService } from '../services/log.service.js';

export const logRouter = Router();

// GET /api/logs — всі логи (тільки читання, записуються автоматично)
logRouter.get('/', (_req: Request, res: Response): void => {
    res.json(logService.getAll());
});