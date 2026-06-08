import { CreateReasonRequestDto, UpdateReasonRequestDto } from '../dto/reason.dto.js';
import { AppError } from '../errors/AppError.js';

export function validateCreateReason(body: unknown): CreateReasonRequestDto {
    const errors: string[] = [];
    const b = body as Record<string, unknown>;

    // name
    if (!b.name || typeof b.name !== 'string') {
        errors.push("name: обов'язкове поле рядкового типу");
    } else if (b.name.trim().length < 2 || b.name.trim().length > 50) {
        errors.push('name: довжина від 2 до 50 символів');
    }

    // description
    if (!b.description || typeof b.description !== 'string') {
        errors.push("description: обов'язкове поле рядкового типу");
    } else if (b.description.trim().length < 5 || b.description.trim().length > 200) {
        errors.push('description: довжина від 5 до 200 символів');
    }

    if (errors.length > 0) {
        throw new AppError(400, 'Помилка валідації', errors);
    }

    return {
        name: (b.name as string).trim(),
        description: (b.description as string).trim(),
    };
}

export function validateUpdateReason(body: unknown): UpdateReasonRequestDto {
    const errors: string[] = [];
    const b = body as Record<string, unknown>;

    if (b.name !== undefined) {
        if (typeof b.name !== 'string') {
            errors.push('name: має бути рядком');
        } else if (b.name.trim().length < 2 || b.name.trim().length > 50) {
            errors.push('name: довжина від 2 до 50 символів');
        }
    }

    if (b.description !== undefined) {
        if (typeof b.description !== 'string') {
            errors.push('description: має бути рядком');
        } else if (b.description.trim().length < 5 || b.description.trim().length > 200) {
            errors.push('description: довжина від 5 до 200 символів');
        }
    }

    if (errors.length > 0) {
        throw new AppError(400, 'Помилка валідації', errors);
    }

    return b as UpdateReasonRequestDto;
}