import { passRepository } from '../repositories/pass.repository.js';
import { userRepository } from '../repositories/user.repository.js';
import {
    CreatePassRequestDto,
    UpdatePassRequestDto,
    PassResponseDto,
} from '../dto/pass.dto.js';
import { PassFilterQuery, PaginatedResult } from '../dto/query.dto.js';
import { toPassResponse } from '../dto/mappers.js';
import { AppError } from '../errors/AppError.js';
import { paginate } from '../utils/paginate.js';

export const passService = {

    getAll(query: PassFilterQuery): PaginatedResult<PassResponseDto> {
        let passes = passRepository.findAll().map(toPassResponse);

        // 1. Фільтрація
        if (query.reason) {
            passes = passes.filter(p => p.reason === query.reason);
        }
        if (query.userId) {
            passes = passes.filter(p => p.userId === query.userId);
        }

        // 2. Сортування
        const sortBy = query.sortBy ?? 'createdAt';
        const order = query.order ?? 'asc';

        passes.sort((a, b) => {
            const valA = a[sortBy] ?? '';
            const valB = b[sortBy] ?? '';
            const cmp = valA < valB ? -1 : valA > valB ? 1 : 0;
            return order === 'asc' ? cmp : -cmp;
        });

        // 3. Пагінація
        const page = Math.max(Number(query.page) || 1, 1);
        const pageSize = Math.min(Math.max(Number(query.pageSize) || 10, 1), 100);

        return paginate(passes, page, pageSize);
    },

    getById(id: string): PassResponseDto {
        const pass = passRepository.findById(id);
        if (!pass) throw new AppError(404, `Пропуск з id=${id} не знайдено`);
        return toPassResponse(pass);
    },

    getByUserId(userId: string): PassResponseDto[] {
        return passRepository.findByUserId(userId).map(toPassResponse);
    },

    create(dto: CreatePassRequestDto): PassResponseDto {
        const userExists = userRepository.findById(dto.userId);
        if (!userExists) throw new AppError(400, `Користувача з id=${dto.userId} не існує`);
        return toPassResponse(passRepository.create({ ...dto, comment: dto.comment ?? '' }));
    },

    update(id: string, dto: UpdatePassRequestDto): PassResponseDto {
        const updated = passRepository.update(id, dto);
        if (!updated) throw new AppError(404, `Пропуск з id=${id} не знайдено`);
        return toPassResponse(updated);
    },

    delete(id: string): void {
        if (!passRepository.delete(id)) {
            throw new AppError(404, `Пропуск з id=${id} не знайдено`);
        }
    },
};