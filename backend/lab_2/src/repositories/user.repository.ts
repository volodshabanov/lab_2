import { v4 as uuidv4 } from 'uuid';
import { User, CreateUserDto, UpdateUserDto } from '../entities/user.entity.js';

const store = new Map<string, User>(); // ← string ключ

export const userRepository = {

    findAll(): User[] {
        return Array.from(store.values());
    },

    findById(id: string): User | undefined {
        return store.get(id);
    },

    create(dto: CreateUserDto): User {
        const user: User = {
            id: uuidv4(),    // ← генеруємо uuid
            ...dto,
            createdAt: new Date(),
        };
        store.set(user.id, user);
        return user;
    },

    update(id: string, dto: UpdateUserDto): User | undefined {
        const existing = store.get(id);
        if (!existing) return undefined;
        const updated: User = { ...existing, ...dto };
        store.set(id, updated);
        return updated;
    },

    delete(id: string): boolean {
        return store.delete(id);
    },
};