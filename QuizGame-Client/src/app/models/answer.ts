import { FormControl } from "@angular/forms";

export interface Answer{
    id: number;
    answerText: string;
    answerImage: string;
}

export interface AnswerForm{
    id?: FormControl<number|null>;
    answerText: FormControl<string|null>;
    answerImage: FormControl<string|null>;
}