import { FormControl } from "@angular/forms";
import { Question } from "./question";
import { User } from "./user";

export interface Quiz{
    id: number;
    name: string;
    description: string;
    questions: Question[];
    gamesId: number[];
    gamesName: number[];
    owner: User[];
}

export interface QuizForm{
    id?: FormControl<number|null>;
    name: FormControl<string|null>;
    description: FormControl<string|null>;
}