import { DatePipe, Location } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Game, GameForm, forbiddenDateValidator } from '../../../models/game';
import { UserListComponent } from '../user-list/user-list.component';
import { GameService } from '../../../services/game.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/cdk/stepper';
import { AsyncPipe, formatDate } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { User } from '../../../models/user';
import { QuizListComponent } from '../quiz-list/quiz-list.component';
import { Quiz } from '../../../models/quiz';
import { QuizService } from '../../../services/quiz.service';

@Component({
  selector: 'app-game-wizard',
  standalone: true,
  imports: [
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    AsyncPipe,
    UserListComponent,
    MatProgressSpinnerModule,
    DatePipe,
    QuizListComponent
  ],
  templateUrl: './game-wizard.component.html',
  styleUrl: './game-wizard.component.css'
})
export class GameWizardComponent {
  gameForm : FormGroup<GameForm> | null = null;
  currentQuiz: Quiz | null = null;
  currentList: User[] = [];

  @ViewChild(UserListComponent) public userList!: UserListComponent;
  @ViewChild(QuizListComponent) public quizList!: QuizListComponent;
  
  stepperOrientation: Observable<StepperOrientation>;
  id: number;

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private quizService: QuizService,
    private snackBar: MatSnackBar,
    private router: Router,
    private location: Location,
    breakpointObserver: BreakpointObserver,
  ) {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.stepperOrientation = breakpointObserver
    .observe('(min-width: 800px)')
    .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit() {
    if(this.id == 0){
      this.gameForm = this.createEmptyForm();
    }
    else{
      this.gameService.getGame(this.id).subscribe( (resp) => {
        if(resp != null){
          this.gameForm = this.createForm(resp);
          this.currentList = resp.assignedUsers;
          this.quizService.getQuiz(resp.quizId).subscribe( (resp) => {
            if(resp != null){
              this.currentQuiz = resp
            }
          })
        }
      });
    }
  }

  createForm(game: Game) : FormGroup<GameForm> {
    return new FormGroup<GameForm>({
      id: new FormControl<number | null> (game.id),
      name: new FormControl<string | null> (game.name, {nonNullable: true, validators: [
        Validators.required, Validators.minLength(3), Validators.maxLength(100)
      ]}),
      passingScore: new FormControl<number> (game.passingScore, {nonNullable: true, validators: [
        Validators.required, Validators.min(0), Validators.max(100), Validators.pattern("^[0-9]*$")
      ]}),
      dueDate: new FormControl<string> (formatDate(game.dueDate, 'yyyy-MM-ddTHH:mm', 'en'), {nonNullable: true, validators: forbiddenDateValidator()}) 
    });
  }

  createEmptyForm() : FormGroup<GameForm> {
    return new FormGroup<GameForm>({
      id: new FormControl<number | null> (0),
      name: new FormControl<string | null> ('', {nonNullable: true, validators: [
        Validators.required, Validators.minLength(3), Validators.maxLength(100)
      ]}),
      passingScore: new FormControl<number> (60, {nonNullable: true, validators: [
        Validators.required, Validators.min(0), Validators.max(100), Validators.pattern("^[0-9]*$")
      ]}),
      dueDate: new FormControl<string> (formatDate(Date.now(), 'yyyy-MM-ddTHH:mm', 'en'), {nonNullable: true, validators: forbiddenDateValidator()})
    });
  }

  createGame(game: Game) {
    this.gameService.createGame(game).subscribe( (resp) => {
      if( typeof resp == 'number') {
        this.snackBar.open('Game created succesfully', 'close', {duration: 2000})
        this.insertUsers(resp);
      }
      else if( typeof resp == 'string'){
        this.snackBar.open(resp, 'close', {duration: 2000})
      }
    });
  }

  updateGame(game: Game) {
    this.gameService.updateGame(game).subscribe( (resp) => {
      if( typeof resp == 'boolean') {
        this.snackBar.open('Game updated succesfully', 'close', {duration: 2000})
        this.insertUsers(game.id);
      }
      else if( typeof resp == 'string'){
        this.snackBar.open(resp, 'close', {duration: 2000})
      }
    });
  }

  insertUsers(id: number) {
    const userIdList = this.userList.totalSelectedUsers.map( (user) => user.id)
    this.gameService.insertUsers(id, userIdList).subscribe( (resp) => {
      if(typeof resp == 'boolean') {
        this.snackBar.open('Users updated succesfully', 'close', {duration: 2000})
        this.router.navigate([`admin/games`]);
      }
      else if( typeof resp == 'string'){
        this.snackBar.open(resp, 'close', {duration: 2000})
      }
    });
  }

  return() {
    this.location.back();
  }

  submitGame() {
    if(this.gameForm?.valid){
      let game: Game;
      game = Object.assign(this.gameForm.value);
      game.dueDate = new Date(game.dueDate);
      game.quizId = this.quizList.selectedQuiz?.id ?? 0;
      game.quizName = this.quizList.selectedQuiz?.name ?? '';
      if(this.id == 0) {
        this.createGame(game);
      }
      else{
        this.updateGame(game)
      }
    }
  }
}

