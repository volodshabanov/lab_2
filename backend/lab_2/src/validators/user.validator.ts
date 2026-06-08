import { CreateUserRequestDto, UpdateUserRequestDto } from '../dto/user.dto.js';
import { AppError } from '../errors/AppError.js';

const VALID_ROLES = ['admin', 'student', 'teacher'] as const;

export function validateCreateUser(body: unknown): CreateUserRequestDto {
    const errors: string[] = [];
    const b = body as Record<string, unknown>;

    // username
    if (!b.username || typeof b.username !== 'string') {
        errors.push("username: обов'язкове поле рядкового типу");
    } else if (b.username.trim().length < 4 || b.username.trim().length > 35) {
        errors.push('username: довжина від 4 до 35 символів');
    }

    // email
    if (!b.email || typeof b.email !== 'string') {
        errors.push("email: обов'язкове поле рядкового типу");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email)) {
        errors.push('email: невірний формат (очікується user@domain.com)');
    }

    // role
    if (!b.role || typeof b.role !== 'string') {
        errors.push("role: обов'язкове поле");
    } else if (!VALID_ROLES.includes(b.role as never)) {
        errors.push(`role: має бути одним з: ${VALID_ROLES.join(', ')}`);
    }

    if (errors.length > 0) {
        throw new AppError(400, 'Помилка валідації', errors);
    }

    return {
        username: (b.username as string).trim(),
        email: b.email as string,
        role: b.role as CreateUserRequestDto['role'],
    };
}

export function validateUpdateUser(body: unknown): UpdateUserRequestDto {
    const errors: string[] = [];
    const b = body as Record<string, unknown>;

    if (b.username !== undefined) {
        if (typeof b.username !== 'string') {
            errors.push('username: має бути рядком');
        } else if (b.username.trim().length < 4 || b.username.trim().length > 35) {
            errors.push('username: довжина від 4 до 35 символів');
        }
    }

    if (b.email !== undefined) {
        if (typeof b.email !== 'string') {
            errors.push('email: має бути рядком');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email)) {
            errors.push('email: невірний формат');
        }
    }

    if (b.role !== undefined && !VALID_ROLES.includes(b.role as never)) {
        errors.push(`role: має бути одним з: ${VALID_ROLES.join(', ')}`);
    }

    if (errors.length > 0) {
        throw new AppError(400, 'Помилка валідації', errors);
    }

    return b as UpdateUserRequestDto;
}