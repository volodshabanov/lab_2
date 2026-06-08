// Загальні query-параметри для списків
export interface PaginationQuery {
    page?: string;      // номер сторінки (з 1)
    pageSize?: string;  // розмір сторінки
}

export interface UserFilterQuery extends PaginationQuery {
    role?: string;      // фільтр за роллю
    sortBy?: 'username' | 'createdAt';
    order?: 'asc' | 'desc';
}

export interface PassFilterQuery extends PaginationQuery {
    reason?: string;    // фільтр за причиною
    userId?: string;    // фільтр за користувачем
    sortBy?: 'validDate' | 'createdAt' | 'userName';
    order?: 'asc' | 'desc';
}

// Результат з пагінацією
export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}