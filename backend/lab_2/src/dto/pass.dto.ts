import { EducationLevel } from '../entities/pass.entity.js';

// --- REQUEST DTOs ---

export interface CreatePassRequestDto {
    userId: string;       // uuid користувача
    userPHD: EducationLevel;
    userName: string;
    reason: string;
    validDate: string;    // формат YYYY-MM-DD
    issuer: string;
    comment?: string;     // необов'язкове поле
}

export interface UpdatePassRequestDto {
    userPHD?: EducationLevel;
    userName?: string;
    reason?: string;
    validDate?: string;
    issuer?: string;
    comment?: string;
}

// --- RESPONSE DTO ---

export interface PassResponseDto {
    id: string;           // uuid — генерується сервером
    userId: string;       // uuid користувача
    userPHD: EducationLevel;
    userName: string;
    reason: string;
    validDate: string;
    issuer: string;
    comment: string;
    createdAt: string;    // ISO рядок
}
export interface PassResponseDto {
    id: string;
    userId: string;
    userPHD: EducationLevel;
    userName: string;
    reasonId: string;  // ← додай
    reason: string;    // ← додай
    validDate: string;
    issuer: string;
    comment: string;
    createdAt: string;
}