export interface Log {
    id: string;        // uuid
    method: string;    // GET, POST, PUT, DELETE
    path: string;      // /api/users
    statusCode: number;
    duration: number;  // мс
    createdAt: Date;
}