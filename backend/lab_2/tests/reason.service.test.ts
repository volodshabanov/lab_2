import { describe, it, expect, beforeEach } from 'vitest';
import { reasonService } from '../src/services/reason.service.js';
import { reasonRepository } from '../src/repositories/reason.repository.js';

beforeEach(() => {
    reasonRepository.findAll().forEach(r => reasonRepository.delete(r.id));
});

describe('reasonService.create', () => {

    it('створює причину і повертає її з id', () => {
        const result = reasonService.create({
            name: 'LabWork',
            description: 'Лабораторна робота',
        });

        expect(result.id).toBeDefined();
        expect(result.name).toBe('LabWork');
        expect(result.description).toBe('Лабораторна робота');
    });

    it('кидає 400 якщо назва вже існує', () => {
        reasonService.create({ name: 'Exam', description: 'Іспит' });

        expect(() =>
            reasonService.create({ name: 'Exam', description: 'Другий іспит' })
        ).toThrowError('вже існує');
    });

});

describe('reasonService.getById', () => {

    it('повертає причину за id', () => {
        const created = reasonService.create({ name: 'PractWork', description: 'Практична робота' });
        const found = reasonService.getById(created.id);
        expect(found.id).toBe(created.id);
    });

    it('кидає 404 якщо не існує', () => {
        expect(() => reasonService.getById('fake-id')).toThrowError('не знайдено');
    });

});

describe('reasonService.delete', () => {

    it('видаляє причину', () => {
        const created = reasonService.create({ name: 'ToDelete', description: 'Буде видалено' });
        reasonService.delete(created.id);
        expect(() => reasonService.getById(created.id)).toThrowError('не знайдено');
    });

});