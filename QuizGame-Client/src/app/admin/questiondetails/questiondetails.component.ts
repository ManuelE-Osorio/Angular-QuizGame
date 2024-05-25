import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Question, QuestionForm } from '../../models/question';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { QuestionsService } from '../../services/questions.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgFor, formatDate } from '@angular/common';
import { AnswerForm } from '../../models/answer';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@Component({
  selector: 'app-questiondetails',
  standalone: true,
  imports: [
    NgFor,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule, 
    FormsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './questiondetails.component.html',
  styleUrl: './questiondetails.component.css'
})
export class QuestionDetailsComponent implements OnInit{
  question: Question | null = null;
  id: number;
  form : FormGroup<QuestionForm> | null = null;
  updateSuccessful : boolean = false;
  errorMessage: string = '';
  isEditing : boolean = false;

  constructor(
    public logDialog: MatDialog,
    private questionsService: QuestionsService,
    private route: ActivatedRoute,
    private location: Location,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router
  ) {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit() {
    if(this.id != 0){
      this.questionsService.getQuestion(this.id).subscribe( (resp) => {
        if(resp != null) {
          this.question = resp;
          this.form = this.createForm(this.question);
          this.form.enable();
        }   
      })
    }
    else {
      this.form = this.createEmptyForm();
      this.form.enable();
    }
  }

  createForm(question: Question) : FormGroup<QuestionForm> {
    let incorrectAnswersGroup: FormGroup<AnswerForm>[] = [];
    question.incorrectAnswers.forEach((answer) => {
      incorrectAnswersGroup.push(
        new FormGroup<AnswerForm>({
          id: new FormControl<number|null>({value: answer.id, disabled: true}),
          answerText: new FormControl<string|null>({value: answer.answerText, disabled: true}),
          answerImage: new FormControl<string|null>({value: answer.answerImage, disabled: true}),
        })
      )
    })

    return new FormGroup<QuestionForm>({
      id: new FormControl<number|null>({value: question.id, disabled: true}),
      questionText: new FormControl<string|null>({value: question.questionText, disabled: true}),
      questionImage: new FormControl<string|null>({value: question.questionImage, disabled: true}),
      secondsTimeout: new FormControl<number|null>({value: question.secondsTimeout, disabled: true}),
      relativeScore: new FormControl<number|null>({value: question.relativeScore, disabled: true}),
      category: new FormControl<string|null>({value: question.category, disabled: true}),
      createdAt: new FormControl<string|null>({value: formatDate(question.createdAt, 'yyyy-MM-ddTHH:mm', 'en'), disabled: true}),
      correctAnswer: new FormGroup<AnswerForm>({
        id: new FormControl<number|null>({value: question.correctAnswer.id, disabled: true}),
        answerText: new FormControl<string|null>({value: question.correctAnswer.answerText, disabled: true}),
        answerImage: new FormControl<string|null>({value: question.correctAnswer.answerImage, disabled: true}),
      }),
      incorrectAnswers: new FormArray<FormGroup<AnswerForm>>(incorrectAnswersGroup),
    });
  }

  createEmptyForm() : FormGroup<QuestionForm> {
    return new FormGroup<QuestionForm>({
      questionText: new FormControl<string|null>(''),
      questionImage: new FormControl<string|null>(''),
      secondsTimeout: new FormControl<number|null>(5),
      relativeScore: new FormControl<number|null>(1),
      category: new FormControl<string|null>(''),
      correctAnswer: new FormGroup<AnswerForm>({
        answerText: new FormControl<string|null>(''),
        answerImage: new FormControl<string|null>(''),
      }),
      incorrectAnswers: new FormArray<FormGroup<AnswerForm>>([new FormGroup<AnswerForm>({
        answerText: new FormControl<string|null>(''),
        answerImage: new FormControl<string|null>(''),
      })]),
    });
  }

  addWrongAnswer() {
    this.form?.controls.incorrectAnswers.push(
      new FormGroup<AnswerForm>({
        id: new FormControl<number|null>(0),
        answerText: new FormControl<string|null>(''),
        answerImage: new FormControl<string|null>(''),
      })
    );

  }

  removeWrongAnswer() {
    this.form?.controls.incorrectAnswers.removeAt(-1)
  }

  createQuestion(question: Question){
    this.questionsService.createQuestion(question).subscribe( (resp) => {
      if(typeof resp == 'number') {
        this.snackBar.open('Question created succesfully', 'close', {duration: 2000});
        this.id = resp;
        question.id = resp
        this.question = question
        this.form = this.createForm(question);
        this.form.enable();
        this.router.navigate([`admin/questions/details/${resp}`]);
      }
      else if( typeof resp == 'string'){
        this.snackBar.open(resp, 'close', {duration: 2000})
      }
    })
  }

  updateQuestion(question: Question){
    this.questionsService.updateQuestion(question).subscribe( (resp) => {
      if(typeof resp == 'boolean') {
        this.snackBar.open('Question updated succesfully', 'close', {duration: 2000});
      }
      else if( typeof resp == 'string'){
        this.snackBar.open(resp, 'close', {duration: 2000})
      }
    })
  }


  submitForm() {
    let question: Question;
    if(this.form?.valid){
      question = Object.assign(this.form.value);
      question.createdAt = new Date(Date.now())
      if(this.id == 0) {
        this.createQuestion(question);
      }
      else{
        this.updateQuestion(question)
      }
    }
  }

  deleteQuestionDialog(){
    if(this.question != null){
      this.dialog.open(ConfirmDeleteDialogComponent, {
        enterAnimationDuration: '400',
        exitAnimationDuration: '400',
        data: 'selected question?'
      }).afterClosed().subscribe( (resp) => {
        console.log(resp)
        if( resp.data === true){
          this.deleteQuestion(this.question!.id)
        }
      });
    }
  }

  deleteQuestion(id: number) {
    this.questionsService.deleteQuestion(id).subscribe( (resp) => {
      if(typeof resp == 'boolean' && resp === true){
        this.snackBar.open('Question deleted succesfully', 'close', {duration: 2000})
        this.router.navigate([`admin/questions`]);
      }
      else if( typeof resp == 'string'){
        this.snackBar.open(resp, 'close', {duration: 2000})
      }
    });
  }

  return() {
    this.router.navigate([`admin/questions`]);
  }
}
