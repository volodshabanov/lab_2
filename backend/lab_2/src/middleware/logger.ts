import { Request, Response, NextFunction } from 'express';
import { logRepository } from '../repositories/log.repository.js';

export function logger(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        const time = new Date().toISOString();

        // 1. Виводимо в консоль як раніше
        console.log(`[${time}] ${req.method} ${req.path} → ${res.statusCode} (${duration}ms)`);

        // 2. Зберігаємо в пам'ять (сутність Logs)
        logRepository.create({
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            duration,
        });
    });

    next();
}