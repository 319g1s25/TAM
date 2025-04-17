// src/models/ta.model.ts

export class TA {
    id!: number;
    name!: string;
    surname!: string;
    email!: string;
    password!: string;
    isOnLeave!: boolean;
    totalWorkload!: number;
    msOrPhdStatus!: string;
    proctoringEnabled!: boolean;
    department!: string;
}