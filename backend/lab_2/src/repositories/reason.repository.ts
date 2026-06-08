import { v4 as uuidv4 } from 'uuid';
import { Reason, CreateReasonDto, UpdateReasonDto } from '../entities/reason.entity.js';

const store = new Map<string, Reason>();

export const reasonRepository = {

    findAll(): Reason[] {
        return Array.from(store.values());
    },

    findById(id: string): Reason | undefined {
        return store.get(id);
    },

    findByName(name: string): Reason | undefined {
        return Array.from(store.values()).find(r => r.name === name);
    },

    create(dto: CreateReasonDto): Reason {
        const reason: Reason = {
            id: uuidv4(),
            ...dto,
            createdAt: new Date(),
        };
        store.set(reason.id, reason);
        return reason;
    },

    update(id: string, dto: UpdateReasonDto): Reason | undefined {
        const existing = store.get(id);
        if (!existing) return undefined;
        const updated: Reason = { ...existing, ...dto };
        store.set(id, updated);
        return updated;
    },

    delete(id: string): boolean {
        return store.delete(id);
    },
};