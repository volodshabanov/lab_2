import { v4 as uuidv4 } from 'uuid';
import { Log } from '../entities/log.entity.js';

const store = new Map<string, Log>();

export const logRepository = {

    findAll(): Log[] {
        // повертаємо від найновіших до найстаріших
        return Array.from(store.values()).sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
    },

    create(data: Omit<Log, 'id' | 'createdAt'>): Log {
        const log: Log = {
            id: uuidv4(),
            ...data,
            createdAt: new Date(),
        };
        store.set(log.id, log);
        return log;
    },
};