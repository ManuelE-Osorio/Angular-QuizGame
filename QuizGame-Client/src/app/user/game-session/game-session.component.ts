import { Component, OnDestroy, OnInit } from '@angular/core';
import { GameSessionService } from '../../services/game-session.service';
import { QuestionForGame } from '../../models/question';
import { ActivatedRoute, Router } from '@angular/router';
import { Answer } from '../../models/answer';
import { Subscription, interval } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { GameScore } from '../../models/score';
import { ScoreService } from '../../services/score.service';
import { ScoreDisplayComponent } from '../score-display/score-display.component';
import { DatePipe } from '@angular/common';
import { Location } from '@angular/common';
import { MatGridListModule} from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-game-session',
  standalone: true,
  imports: [
    AsyncPipe,
    ScoreDisplayComponent,
    DatePipe,
    MatGridListModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './game-session.component.html',
  styleUrl: './game-session.component.css'
})
export class GameSessionComponent implements OnInit, OnDestroy{


  gameId: number = 0;
  question: QuestionForGame | null = null
  answers: Answer[] = []; 
  timer = interval(1000)
  seconds : number = 0;
  timerSubscription?: Subscription;
  currentQuestion?: Subscription;
  currentQuestionTimeout?: Subscription;
  isFinished = false;
  score? : GameScore;
  colors : string[] = []
  loading = true;
  colorList = ['ff6600', 'ff3399', '9966ff', '66ff66', 
  '66ffff', '66ccff', 'ff0000', '00cc66', 
  '0099cc', '3333ff', 'ff6699', 'ffccff']

  constructor(
    private gameSessionService: GameSessionService,
    private scoreService: ScoreService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.gameId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit() {
    this.currentQuestion = this.gameSessionService.getCurrentQuestion().subscribe( (question) => {
      if(question != null){
        this.question = question
        this.colors = []
        this.colors = this.question.answers.map( () => this.getRandomColor())
      }
      else{
        this.finishGame();
      }
    })
    
    this.currentQuestionTimeout = this.gameSessionService.getCurrentQuestionTimeout().subscribe( (seconds) => {
      if(seconds != null){
        this.seconds = seconds;
      }
    })

  }

  timeout(){
    this.timerSubscription?.unsubscribe();
    this.loading = true;
    this.gameSessionService.nextQuestion();
  }

  timerSubscriptionAssign(){
    this.timerSubscription = this.timer.subscribe( () => {
      this.seconds--;
      if(this.seconds == 0){
        this.timeout();
      }
    })
  }

  nextQuestion(questionId: number, answer: Answer){
    this.timerSubscription?.unsubscribe();
    this.loading = true;
    this.answers.push( {id: questionId, answerText: answer.answerText, answerImage: answer.answerImage})
    this.gameSessionService.nextQuestion();
  }

  finishGame(){
    this.timerSubscription?.unsubscribe();
    this.isFinished = true;
    this.currentQuestion?.unsubscribe();
    this.scoreService.createScore(this.gameId, this.answers).subscribe( (resp) => {
      if(typeof resp != 'string'){
        this.score = resp
      }
    })
  }

  return(){
    this.location.back();
  }

  mainMenu() {
    this.router.navigate(['user'])
  }

  ngOnDestroy(): void {
    this.currentQuestion?.unsubscribe();
    this.currentQuestionTimeout?.unsubscribe();
    this.timerSubscription?.unsubscribe();
  }
  
  getRandomColor() : string{
    return '#'+this.colorList[Math.floor(Math.random()*this.colorList.length)];
  }
  
  continue() {
    this.loading = false;
    this.timerSubscriptionAssign();
  }
}
