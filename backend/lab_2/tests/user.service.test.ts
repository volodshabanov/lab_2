import { describe, it, expect, beforeEach } from 'vitest';
import { userService } from '../src/services/user.service.js';
import { userRepository } from '../src/repositories/user.repository.js';

// Очищаємо store перед кожним тестом
beforeEach(() => {
    // Очищаємо всіх юзерів через видалення кожного
    userRepository.findAll().forEach(u => userRepository.delete(u.id));
});

describe('userService.create', () => {

    it('створює юзера і повертає його з id', () => {
        const result = userService.create({
            username: 'denis_test',
            email: 'denis@test.com',
            role: 'student',
        });

        expect(result.id).toBeDefined();
        expect(result.username).toBe('denis_test');
        expect(result.email).toBe('denis@test.com');
        expect(result.role).toBe('student');
        expect(result.createdAt).toBeDefined();
    });

    it('кидає 400 якщо email вже існує', () => {
        userService.create({ username: 'user_one', email: 'same@test.com', role: 'student' });

        expect(() =>
            userService.create({ username: 'user_two', email: 'same@test.com', role: 'teacher' })
        ).toThrowError('вже використовується');
    });

});

describe('userService.getById', () => {

    it('повертає юзера за існуючим id', () => {
        const created = userService.create({ username: 'find_me', email: 'find@test.com', role: 'admin' });
        const found = userService.getById(created.id);
        expect(found.id).toBe(created.id);
    });

    it('кидає 404 якщо id не існує', () => {
        expect(() => userService.getById('non-existent-id')).toThrowError('не знайдено');
    });

});

describe('userService.update', () => {

    it('оновлює поля юзера', () => {
        const created = userService.create({ username: 'old_name', email: 'upd@test.com', role: 'student' });
        const updated = userService.update(created.id, { username: 'new_name' });
        expect(updated.username).toBe('new_name');
        expect(updated.email).toBe('upd@test.com'); // не змінилось
    });

    it('кидає 404 при оновленні неіснуючого id', () => {
        expect(() => userService.update('fake-id', { username: 'x_user' })).toThrowError('не знайдено');
    });

});

describe('userService.delete', () => {

    it('видаляє юзера', () => {
        const created = userService.create({ username: 'del_user', email: 'del@test.com', role: 'student' });
        userService.delete(created.id);
        expect(() => userService.getById(created.id)).toThrowError('не знайдено');
    });

    it('кидає 404 при видаленні неіснуючого id', () => {
        expect(() => userService.delete('fake-id')).toThrowError('не знайдено');
    });

});

describe('userService.getAll', () => {

    it('повертає порожній список якщо немає юзерів', () => {
        const result = userService.getAll({});
        expect(result.data).toHaveLength(0);
        expect(result.total).toBe(0);
    });

    it('фільтрує за роллю', () => {
        userService.create({ username: 'student_1', email: 's1@test.com', role: 'student' });
        userService.create({ username: 'teacher_1', email: 't1@test.com', role: 'teacher' });

        const result = userService.getAll({ role: 'student' });
        expect(result.data).toHaveLength(1);
        expect(result.data[0].role).toBe('student');
    });

});