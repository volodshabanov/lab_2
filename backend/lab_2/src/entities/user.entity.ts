export type UserRole = 'admin' | 'student' | 'teacher';

export interface User {
    id: string;        // ← тепер uuid string
    username: string;
    email: string;
    role: UserRole;
    createdAt: Date;
}

export interface CreateUserDto {
    username: string;
    email: string;
    role: UserRole;
}

export interface UpdateUserDto {
    username?: string;
    email?: string;
    role?: UserRole;
}