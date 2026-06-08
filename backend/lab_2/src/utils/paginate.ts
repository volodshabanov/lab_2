import { PaginatedResult } from '../dto/query.dto.js';

export function paginate<T>(
    items: T[],
    page: number,
    pageSize: number
): PaginatedResult<T> {
    const total = items.length;
    const totalPages = Math.ceil(total / pageSize);
    const safePage = Math.min(Math.max(page, 1), totalPages || 1);
    const start = (safePage - 1) * pageSize;
    const data = items.slice(start, start + pageSize);

    return { data, total, page: safePage, pageSize, totalPages };
}