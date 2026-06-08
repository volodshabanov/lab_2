import { reasonRepository } from '../repositories/reason.repository.js';
import {
    CreateReasonRequestDto,
    UpdateReasonRequestDto,
    ReasonResponseDto,
} from '../dto/reason.dto.js';
import { toReasonResponse } from '../dto/mappers.js';
import { AppError } from '../errors/AppError.js';

export const reasonService = {

    getAll(): ReasonResponseDto[] {
        return reasonRepository.findAll().map(toReasonResponse);
    },

    getById(id: string): ReasonResponseDto {
        const reason = reasonRepository.findById(id);
        if (!reason) throw new AppError(404, `Причину з id=${id} не знайдено`);
        return toReasonResponse(reason);
    },

    create(dto: CreateReasonRequestDto): ReasonResponseDto {
        // перевірка унікальності назви
        const exists = reasonRepository.findByName(dto.name);
        if (exists) throw new AppError(400, `Причина з назвою "${dto.name}" вже існує`);
        return toReasonResponse(reasonRepository.create(dto));
    },

    update(id: string, dto: UpdateReasonRequestDto): ReasonResponseDto {
        // якщо змінюють назву — перевіряємо унікальність
        if (dto.name) {
            const exists = reasonRepository.findByName(dto.name);
            if (exists && exists.id !== id) {
                throw new AppError(400, `Причина з назвою "${dto.name}" вже існує`);
            }
        }
        const updated = reasonRepository.update(id, dto);
        if (!updated) throw new AppError(404, `Причину з id=${id} не знайдено`);
        return toReasonResponse(updated);
    },

    delete(id: string): void {
        if (!reasonRepository.delete(id)) {
            throw new AppError(404, `Причину з id=${id} не знайдено`);
        }
    },
};