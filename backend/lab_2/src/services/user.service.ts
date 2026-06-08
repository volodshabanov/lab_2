import { userRepository } from '../repositories/user.repository.js';
import {
    CreateUserRequestDto,
    UpdateUserRequestDto,
    UserResponseDto,
} from '../dto/user.dto.js';
import { UserFilterQuery, PaginatedResult } from '../dto/query.dto.js';
import { toUserResponse } from '../dto/mappers.js';
import { AppError } from '../errors/AppError.js';
import { paginate } from '../utils/paginate.js';

export const userService = {

    getAll(query: UserFilterQuery): PaginatedResult<UserResponseDto> {
        let users = userRepository.findAll().map(toUserResponse);

        // 1. Фільтрація за роллю
        if (query.role) {
            users = users.filter(u => u.role === query.role);
        }

        // 2. Сортування
        const sortBy = query.sortBy ?? 'createdAt';
        const order = query.order ?? 'asc';

        users.sort((a, b) => {
            const valA = a[sortBy] ?? '';
            const valB = b[sortBy] ?? '';
            const cmp = valA < valB ? -1 : valA > valB ? 1 : 0;
            return order === 'asc' ? cmp : -cmp;
        });

        // 3. Пагінація
        const page = Math.max(Number(query.page) || 1, 1);
        const pageSize = Math.min(Math.max(Number(query.pageSize) || 10, 1), 100);

        return paginate(users, page, pageSize);
    },

    getById(id: string): UserResponseDto {
        const user = userRepository.findById(id);
        if (!user) throw new AppError(404, `Користувача з id=${id} не знайдено`);
        return toUserResponse(user);
    },

    create(dto: CreateUserRequestDto): UserResponseDto {
        const exists = userRepository.findAll().some(u => u.email === dto.email);
        if (exists) throw new AppError(400, `Email "${dto.email}" вже використовується`);
        return toUserResponse(userRepository.create(dto));
    },

    update(id: string, dto: UpdateUserRequestDto): UserResponseDto {
        const updated = userRepository.update(id, dto);
        if (!updated) throw new AppError(404, `Користувача з id=${id} не знайдено`);
        return toUserResponse(updated);
    },

    delete(id: string): void {
        if (!userRepository.delete(id)) {
            throw new AppError(404, `Користувача з id=${id} не знайдено`);
        }
    },
};