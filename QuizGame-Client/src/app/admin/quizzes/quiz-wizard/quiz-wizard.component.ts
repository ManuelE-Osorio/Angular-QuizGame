import { Location } from '@angular/common';
import { AsyncPipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { StepperOrientation, MatStepperModule} from '@angular/material/stepper';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Quiz, QuizForm } from '../../../models/quiz';
import { QuestionListComponent } from '../question-list/question-list.component';
import { MatListModule } from '@angular/material/list';
import { QuizService } from '../../../services/quiz.service';
import { Question } from '../../../models/question';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-quiz-wizard',
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
    QuestionListComponent,
    MatProgressSpinnerModule
  ],
  templateUrl: './quiz-wizard.component.html',
  styleUrl: './quiz-wizard.component.css'
})
export class QuizWizardComponent implements OnInit{

  quizForm : FormGroup<QuizForm> | null = null;
  currentList: Question[] = [];

  @ViewChild(QuestionListComponent) public questionList!: QuestionListComponent;
  
  stepperOrientation: Observable<StepperOrientation>;
  id: number;

  constructor(
    private route: ActivatedRoute,
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
      this.quizForm = this.createEmptyForm();
    }
    else{
      this.quizService.getQuiz(this.id).subscribe( (resp) => {
        if(resp != null){
          this.quizForm = this.createForm(resp);
          this.currentList = resp.questions;
        }
      });
    }
  }

  createForm(quiz: Quiz) : FormGroup<QuizForm> {
    return new FormGroup<QuizForm>({
      id: new FormControl<number | null> (quiz.id),
      name: new FormControl<string | null> (quiz.name, {nonNullable: true, validators: [
        Validators.required, Validators.minLength(3), Validators.maxLength(100)
      ]}),
      description: new FormControl<string | null> (quiz.description),
    });
  }

  createEmptyForm() : FormGroup<QuizForm> {
    return new FormGroup<QuizForm>({
      id: new FormControl<number | null> (0),
      name: new FormControl<string | null> ('', {nonNullable: true, validators: [
        Validators.required, Validators.minLength(3), Validators.maxLength(100)
      ]}),
      description: new FormControl<string | null> (''),
    });
  }

  createQuiz(quiz: Quiz) {
    this.quizService.createQuiz(quiz).subscribe( (resp) => {
      if( typeof resp == 'number') {
        this.snackBar.open('Quiz created succesfully', 'close', {duration: 2000})
        this.insertQuestions(resp);
      }
      else if( typeof resp == 'string'){
        this.snackBar.open(resp, 'close', {duration: 2000})
      }
    });
  }

  updateQuiz(quiz: Quiz) {
    this.quizService.updateQuiz(quiz).subscribe( (resp) => {
      if( typeof resp == 'boolean') {
        this.snackBar.open('Quiz updated succesfully', 'close', {duration: 2000})
        this.insertQuestions(quiz.id);
      }
      else if( typeof resp == 'string'){
        this.snackBar.open(resp, 'close', {duration: 2000})
      }
    });
  }

  insertQuestions(id: number) {
    const questionIdList = this.questionList.totalSelectedQuestions.map( (question) => question.id)
    this.quizService.insertQuestions(id, questionIdList).subscribe( (resp) => {
      if(typeof resp == 'boolean') {
        this.snackBar.open('Questions updated succesfully', 'close', {duration: 2000})
        this.router.navigate([`admin/quizzes`]);
      }
      else if( typeof resp == 'string'){
        this.snackBar.open(resp, 'close', {duration: 2000})
      }
    });
  }

  return() {
    this.location.back();
  }

  submitQuiz() {
    let quiz: Quiz;
    if(this.quizForm?.valid){
      quiz = Object.assign(this.quizForm.value);
      if(this.id == 0) {
        this.createQuiz(quiz);
      }
      else{
        this.updateQuiz(quiz)
      }
    }
  }
}
