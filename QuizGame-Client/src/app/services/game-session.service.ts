import { Injectable } from '@angular/core';
import { QuizService } from './quiz.service';
import { QuestionsService } from './questions.service';
import { QuestionForGame } from '../models/question';
import { BehaviorSubject, Observable, Subject, interval, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameSessionService {

  public questions: QuestionForGame[] = [];
  public currentState: number = 0;
  public totalStates: number = 0;
  private _currentQuestion: Subject<QuestionForGame | null> = new Subject();  
  private _currentQuestionTimeout: Subject<number> = new Subject();

    

  constructor(
    private quizService: QuizService,
    private questionService: QuestionsService
  ) { }

  public loadQuestions(id: number) {
    this.questionService.getQuestionsByGame(id).subscribe( (resp) => {
      if(resp != null) {
        this.questions = resp.map( (question) => ({
          question, sort: Math.random()
        })).sort( (a, b) => a.sort - b.sort).map(({question}) => question);
        this.currentState = 0;
        this.totalStates = this.questions.length;
        this._currentQuestion.next(this.questions[0])
        this._currentQuestionTimeout.next(this.questions[0].secondsTimeout)
      }
    })
  }

  public getCurrentQuestion(){
    return this._currentQuestion.asObservable();
  }

  public getCurrentQuestionTimeout(){
    return this._currentQuestionTimeout.asObservable();
  }

  public nextQuestion(){
    this.currentState++
    if(this.currentState < this.totalStates){
      this._currentQuestion.next(this.questions[this.currentState])
      this._currentQuestionTimeout.next(this.questions[this.currentState].secondsTimeout);
    }
    else{
      this._currentQuestion.next(null)
    }
  }
}
