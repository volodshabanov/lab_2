import { Router, Request, Response, NextFunction } from 'express';
import { reasonService } from '../services/reason.service.js';
import { validateCreateReason, validateUpdateReason } from '../validators/reason.validator.js';

export const reasonRouter = Router();

// GET /api/reasons — всі причини
reasonRouter.get('/', (_req: Request, res: Response): void => {
    res.json(reasonService.getAll());
});

// GET /api/reasons/:id — одна причина
reasonRouter.get('/:id', (req: Request<{ id: string }>, res: Response, next: NextFunction): void => {
    try {
        res.json(reasonService.getById(req.params.id));
    } catch (e) { next(e); }
});

// POST /api/reasons — створити причину
reasonRouter.post('/', (req: Request, res: Response, next: NextFunction): void => {
    try {
        const dto = validateCreateReason(req.body);
        res.status(201).json(reasonService.create(dto));
    } catch (e) { next(e); }
});

// PUT /api/reasons/:id — оновити причину
reasonRouter.put('/:id', (req: Request<{ id: string }>, res: Response, next: NextFunction): void => {
    try {
        const dto = validateUpdateReason(req.body);
        res.json(reasonService.update(req.params.id, dto));
    } catch (e) { next(e); }
});

// DELETE /api/reasons/:id — видалити причину
reasonRouter.delete('/:id', (req: Request<{ id: string }>, res: Response, next: NextFunction): void => {
    try {
        reasonService.delete(req.params.id);
        res.status(204).send();
    } catch (e) { next(e); }
});