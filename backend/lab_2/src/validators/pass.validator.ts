import { CreatePassRequestDto, UpdatePassRequestDto } from '../dto/pass.dto.js';
import { AppError } from '../errors/AppError.js';

const VALID_REASONS = ['LabWork', 'PractWork', 'Exam', 'ModuleWork'] as const;
const VALID_PHD = ['Baclvr', 'Magistr'] as const;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/; // формат YYYY-MM-DD
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function validateCreatePass(body: unknown): CreatePassRequestDto {
    const errors: string[] = [];
    const b = body as Record<string, unknown>;

    // userId
    if (!b.userId || typeof b.userId !== 'string') {
        errors.push("userId: обов'язкове поле");
    } else if (!UUID_REGEX.test(b.userId)) {
        errors.push('userId: має бути валідним UUID');
    }

    // userPHD
    if (!b.userPHD || typeof b.userPHD !== 'string') {
        errors.push("userPHD: обов'язкове поле");
    } else if (!VALID_PHD.includes(b.userPHD as never)) {
        errors.push(`userPHD: має бути одним з: ${VALID_PHD.join(', ')}`);
    }

    // userName
    if (!b.userName || typeof b.userName !== 'string') {
        errors.push("userName: обов'язкове поле");
    } else if (b.userName.trim().length < 4 || b.userName.trim().length > 35) {
        errors.push('userName: довжина від 4 до 35 символів');
    }

    // reason
    if (!b.reason || typeof b.reason !== 'string') {
        errors.push("reason: обов'язкове поле");
    } else if (!VALID_REASONS.includes(b.reason as never)) {
        errors.push(`reason: має бути одним з: ${VALID_REASONS.join(', ')}`);
    }

    // validDate — ISO формат YYYY-MM-DD
    if (!b.validDate || typeof b.validDate !== 'string') {
        errors.push("validDate: обов'язкове поле");
    } else if (!DATE_REGEX.test(b.validDate) || isNaN(Date.parse(b.validDate))) {
        errors.push('validDate: має бути у форматі YYYY-MM-DD (наприклад 2025-06-01)');
    }

    // issuer
    if (!b.issuer || typeof b.issuer !== 'string') {
        errors.push("issuer: обов'язкове поле");
    } else if (b.issuer.trim().length < 2) {
        errors.push('issuer: мінімум 2 символи');
    }

    // comment — необов'язкове
    if (b.comment !== undefined && typeof b.comment !== 'string') {
        errors.push('comment: має бути рядком');
    }

    if (errors.length > 0) {
        throw new AppError(400, 'Помилка валідації', errors);
    }

    return {
        userId: b.userId as string,
        userPHD: b.userPHD as CreatePassRequestDto['userPHD'],
        userName: (b.userName as string).trim(),
        reason: b.reason as CreatePassRequestDto['reason'],
        validDate: b.validDate as string,
        issuer: (b.issuer as string).trim(),
        comment: typeof b.comment === 'string' ? b.comment.trim() : '',
    };
}

export function validateUpdatePass(body: unknown): UpdatePassRequestDto {
    const errors: string[] = [];
    const b = body as Record<string, unknown>;

    if (b.userPHD !== undefined && !VALID_PHD.includes(b.userPHD as never)) {
        errors.push(`userPHD: має бути одним з: ${VALID_PHD.join(', ')}`);
    }

    if (b.reason !== undefined && !VALID_REASONS.includes(b.reason as never)) {
        errors.push(`reason: має бути одним з: ${VALID_REASONS.join(', ')}`);
    }

    if (b.validDate !== undefined) {
        if (typeof b.validDate !== 'string' ||
            !DATE_REGEX.test(b.validDate) ||
            isNaN(Date.parse(b.validDate))) {
            errors.push('validDate: має бути у форматі YYYY-MM-DD');
        }
    }

    if (b.userName !== undefined && typeof b.userName === 'string') {
        if (b.userName.trim().length < 4 || b.userName.trim().length > 35) {
            errors.push('userName: довжина від 4 до 35 символів');
        }
    }

    if (errors.length > 0) {
        throw new AppError(400, 'Помилка валідації', errors);
    }

    return b as UpdatePassRequestDto;
}