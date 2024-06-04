import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";
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
    passingScore: FormControl<number|null>;
    dueDate: FormControl<string>;
}

export function forbiddenDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const dueDate = new Date(control.value)
        const now = new Date(Date.now())
        const result = now > dueDate
        return result ? { invalidDate: { value: control.value } } : null;
    };
}