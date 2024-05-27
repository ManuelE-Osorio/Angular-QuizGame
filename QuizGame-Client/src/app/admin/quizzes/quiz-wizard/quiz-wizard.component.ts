import { AsyncPipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {StepperOrientation, MatStepperModule} from '@angular/material/stepper';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Quiz, QuizForm } from '../../../models/quiz';
import { QuestionListComponent } from '../question-list/question-list.component';
import {MatListModule} from '@angular/material/list';
import { QuizService } from '../../../services/quiz.service';
import { Question } from '../../../models/question';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    QuestionListComponent
  ],
  templateUrl: './quiz-wizard.component.html',
  styleUrl: './quiz-wizard.component.css'
})
export class QuizWizardComponent {

  quizForm : FormGroup<QuizForm>;

  @ViewChild(QuestionListComponent) public questionList!: QuestionListComponent;
  
  stepperOrientation: Observable<StepperOrientation>;
  id: number;

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService,
    private snackBar: MatSnackBar,
    private router: Router,
    breakpointObserver: BreakpointObserver,
  ) {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.stepperOrientation = breakpointObserver
    .observe('(min-width: 800px)')
    .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));
    this.quizForm = this.createEmptyForm();
  }

  createEmptyForm() : FormGroup<QuizForm> {
    return new FormGroup<QuizForm>({
      id: new FormControl<number | null> (0),
      name: new FormControl<string | null> (''),
      description: new FormControl<string | null> (''),
    })
  }

  createQuiz(quiz: Quiz){
    this.quizService.createQuiz(quiz).subscribe( (resp) => {
      if( typeof resp == 'number') {
        this.insertQuestions(resp);
      }
    })
  }

  updateQuiz(quiz: Quiz){

  }

  insertQuestions(id: number){
    const questionIdList = this.questionList.totalSelectedQuestions.map( (question) => question.id)
    this.quizService.insertQuestions(id, questionIdList).subscribe( (resp) => {
      if(typeof resp == 'boolean') {
        this.snackBar.open('Quiz created succesfully', 'close', {duration: 2000})
        this.router.navigate([`admin/quizzes`]);
      }
    })

  }

  submitQuiz() {
    let quiz: Quiz;
    if(this.quizForm?.valid){
      quiz = Object.assign(this.quizForm.value);
      console.log(quiz)
      // if(this.id == 0) {
      //   this.createQuiz(quiz);
      // }
      // else{
      //   this.updateQuiz(quiz)
      // }
    }
  }
}
