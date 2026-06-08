import { User } from '../entities/user.entity.js';
import { Pass } from '../entities/pass.entity.js';
import { Reason } from '../entities/reason.entity.js';
import { Log } from '../entities/log.entity.js';
import { UserResponseDto } from './user.dto.js';
import { PassResponseDto } from './pass.dto.js';
import { ReasonResponseDto } from './reason.dto.js';
import { LogResponseDto } from './log.dto.js';

export function toUserResponse(user: User): UserResponseDto {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
    };
}

export function toPassResponse(pass: Pass): PassResponseDto {
    return {
        id: pass.id,
        userId: pass.userId,
        userPHD: pass.userPHD,
        userName: pass.userName,
        reasonId: pass.reasonId,   // ← тепер посилання на Reason
        reason: pass.reason,       // ← назва причини (для зручності)
        validDate: pass.validDate,
        issuer: pass.issuer,
        comment: pass.comment,
        createdAt: pass.createdAt.toISOString(),
    };
}

export function toReasonResponse(reason: Reason): ReasonResponseDto {
    return {
        id: reason.id,
        name: reason.name,
        description: reason.description,
        createdAt: reason.createdAt.toISOString(),
    };
}

export function toLogResponse(log: Log): LogResponseDto {
    return {
        id: log.id,
        method: log.method,
        path: log.path,
        statusCode: log.statusCode,
        duration: log.duration,
        createdAt: log.createdAt.toISOString(),
    };
}