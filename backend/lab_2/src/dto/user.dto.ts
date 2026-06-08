import { UserRole } from '../entities/user.entity.js';

// --- REQUEST DTOs (від клієнта до сервера) ---

export interface CreateUserRequestDto {
    username: string;
    email: string;
    role: UserRole;
}

export interface UpdateUserRequestDto {
    username?: string;
    email?: string;
    role?: UserRole;
}

// --- RESPONSE DTO (від сервера до клієнта) ---

export interface UserResponseDto {
    id: string;          // uuid — генерується сервером
    username: string;
    email: string;
    role: UserRole;
    createdAt: string;   // ISO рядок, не об'єкт Date
}