import { Injectable } from '@angular/core';
import { QuizService } from './quiz.service';
import { QuestionsService } from './questions.service';
import { QuestionForGame } from '../models/question';

@Injectable({
  providedIn: 'root'
})
export class GameSessionService {

  public questions: QuestionForGame[] = [];

  constructor(
    private quizService: QuizService,
    private questionService: QuestionsService
  ) { }

  public getQuestions(id: number) {
    this.questionService.getQuestionsByGame(id).subscribe( (resp) => {
      if(resp != null) {
        this.questions = resp
      }
    })
  }
}
