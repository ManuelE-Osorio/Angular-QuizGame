import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { Answer, AnswerForm } from "./answer";
import { User } from "./user";

export interface Question{
    id: number;
    questionText: string;
    questionImage: string;
    secondsTimeout: number;
    relativeScore: number;
    category: string;
    createdAt: Date;
    correctAnswer: Answer;
    incorrectAnswers: Answer[];
    owner: User;
    assignedQuizzes: string[];
}

export interface QuestionForGame{
    id: number;
    questionText: string;
    questionImage: string;
    secondsTimeout: number;
    answers: Answer[];
}


export interface QuestionForm{
    id?: FormControl<number|null>;
    questionText: FormControl<string|null>;
    questionImage: FormControl<string|null>;
    secondsTimeout: FormControl<number|null>;
    relativeScore: FormControl<number|null>;
    category: FormControl<string|null>;
    createdAt?: FormControl<string|null>;
    correctAnswer: FormGroup<AnswerForm>;
    incorrectAnswers: FormArray<FormGroup<AnswerForm>>;
}