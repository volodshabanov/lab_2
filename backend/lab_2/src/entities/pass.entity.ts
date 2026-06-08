export type EducationLevel = 'Baclvr' | 'Magistr';

export interface Pass {
    id: string;
    userId: string;
    userPHD: EducationLevel;
    userName: string;
    reasonId: string;    // ← uuid посилання на Reason
    reason: string;      // ← назва причини (копія для зручності читання)
    validDate: string;
    issuer: string;
    comment: string;
    createdAt: Date;
}

export interface CreatePassDto {
    userId: string;
    userPHD: EducationLevel;
    userName: string;
    reasonId: string;
    reason: string;
    validDate: string;
    issuer: string;
    comment: string;
}

export interface UpdatePassDto {
    userPHD?: EducationLevel;
    userName?: string;
    reasonId?: string;
    reason?: string;
    validDate?: string;
    issuer?: string;
    comment?: string;
}