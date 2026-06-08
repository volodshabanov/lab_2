import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError.js';

export function errorHandler(
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    // Очікувана помилка (404, 400, etc.)
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            status: 'error',
            statusCode: err.statusCode,
            message: err.message,
            ...(err.details && { details: err.details }),
        });
        return;
    }

    // Непередбачувана помилка (500)
    console.error('Unexpected error:', err);
    res.status(500).json({
        status: 'error',
        statusCode: 500,
        message: 'Внутрішня помилка сервера',
    });
}