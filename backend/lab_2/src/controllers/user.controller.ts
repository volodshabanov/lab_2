import { Router, Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service.js';
import { validateCreateUser, validateUpdateUser } from '../validators/user.validator.js';
import { UserFilterQuery } from '../dto/query.dto.js';

export const userRouter = Router();

userRouter.get('/', (req: Request, res: Response): void => {
    const query = req.query as UserFilterQuery;
    res.json(userService.getAll(query));
});

userRouter.get('/:id', (req: Request<{ id: string }>, res: Response, next: NextFunction): void => {
    try {
        res.json(userService.getById(req.params.id));
    } catch (e) { next(e); }
});

userRouter.post('/', (req: Request, res: Response, next: NextFunction): void => {
    try {
        const dto = validateCreateUser(req.body);
        res.status(201).json(userService.create(dto));
    } catch (e) { next(e); }
});

userRouter.put('/:id', (req: Request<{ id: string }>, res: Response, next: NextFunction): void => {
    try {
        const dto = validateUpdateUser(req.body);
        res.json(userService.update(req.params.id, dto));
    } catch (e) { next(e); }
});

userRouter.delete('/:id', (req: Request<{ id: string }>, res: Response, next: NextFunction): void => {
    try {
        userService.delete(req.params.id);
        res.status(204).send();
    } catch (e) { next(e); }
});