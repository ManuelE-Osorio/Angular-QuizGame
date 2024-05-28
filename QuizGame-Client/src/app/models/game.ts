import { FormControl } from "@angular/forms";
import { User } from "./user";

export interface Game{
    id: number;
    name: string;
    passingScore: number;
    dueDate: Date;
    quizId: number;
    quizName: string;
    assignedUsers: User[];
    owner: User;
}

export interface GameForm{
    id?: FormControl<number|null>;
    name: FormControl<string|null>;
    description: FormControl<string|null>;
}