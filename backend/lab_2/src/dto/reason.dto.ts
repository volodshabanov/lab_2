// --- REQUEST DTOs ---

export interface CreateReasonRequestDto {
    name: string;
    description: string;
}

export interface UpdateReasonRequestDto {
    name?: string;
    description?: string;
}

// --- RESPONSE DTO ---

export interface ReasonResponseDto {
    id: string;
    name: string;
    description: string;
    createdAt: string; // ISO рядок
}
  