export interface LogResponseDto {
    id: string;
    method: string;
    path: string;
    statusCode: number;
    duration: number;  // мс
    createdAt: string; // ISO рядок
}