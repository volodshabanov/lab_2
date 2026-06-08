import { Router, Request, Response, NextFunction } from 'express';
import { passService } from '../services/pass.service.js';
import { validateCreatePass, validateUpdatePass } from '../validators/pass.validator.js';
import { PassFilterQuery } from '../dto/query.dto.js';

export const passRouter = Router();

passRouter.get('/', (req: Request, res: Response): void => {
    const query = req.query as PassFilterQuery;
    res.json(passService.getAll(query));
});

passRouter.get('/user/:userId', (req: Request<{ userId: string }>, res: Response): void => {
    res.json(passService.getByUserId(req.params.userId));
});

passRouter.get('/:id', (req: Request<{ id: string }>, res: Response, next: NextFunction): void => {
    try {
        res.json(passService.getById(req.params.id));
    } catch (e) { next(e); }
});

passRouter.post('/', (req: Request, res: Response, next: NextFunction): void => {
    try {
        const dto = validateCreatePass(req.body);
        res.status(201).json(passService.create(dto));
    } catch (e) { next(e); }
});

passRouter.put('/:id', (req: Request<{ id: string }>, res: Response, next: NextFunction): void => {
    try {
        const dto = validateUpdatePass(req.body);
        res.json(passService.update(req.params.id, dto));
    } catch (e) { next(e); }
});

passRouter.delete('/:id', (req: Request<{ id: string }>, res: Response, next: NextFunction): void => {
    try {
        passService.delete(req.params.id);
        res.status(204).send();
    } catch (e) { next(e); }
});