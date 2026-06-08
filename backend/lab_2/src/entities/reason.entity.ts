export interface Reason {
    id: string;        // uuid
    name: string;      // назва причини (LabWork, Exam, тощо)
    description: string; // опис причини
    createdAt: Date;
}

export interface CreateReasonDto {
    name: string;
    description: string;
}

export interface UpdateReasonDto {
    name?: string;
    description?: string;
}
 