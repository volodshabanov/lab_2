import { v4 as uuidv4 } from 'uuid';
import { Pass, CreatePassDto, UpdatePassDto } from '../entities/pass.entity.js';

const store = new Map<string, Pass>(); // ← string ключ

export const passRepository = {

    findAll(): Pass[] {
        return Array.from(store.values());
    },

    findById(id: string): Pass | undefined {
        return store.get(id);
    },

    findByUserId(userId: string): Pass[] {
        return Array.from(store.values()).filter(p => p.userId === userId);
    },

    create(dto: CreatePassDto): Pass {
        const pass: Pass = {
            id: uuidv4(),    // ← генеруємо uuid
            ...dto,
            createdAt: new Date(),
        };
        store.set(pass.id, pass);
        return pass;
    },

    update(id: string, dto: UpdatePassDto): Pass | undefined {
        const existing = store.get(id);
        if (!existing) return undefined;
        const updated: Pass = { ...existing, ...dto };
        store.set(id, updated);
        return updated;
    },

    delete(id: string): boolean {
        return store.delete(id);
    },
};