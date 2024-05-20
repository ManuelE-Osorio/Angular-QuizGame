import { Answer } from "./answer";
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
    assignedQuizzes: number[];
}