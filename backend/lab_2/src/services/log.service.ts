import { logRepository } from '../repositories/log.repository.js';
import { LogResponseDto } from '../dto/log.dto.js';
import { toLogResponse } from '../dto/mappers.js';

export const logService = {

    // Logs тільки читаються через API
    getAll(): LogResponseDto[] {
        return logRepository.findAll().map(toLogResponse);
    },
};