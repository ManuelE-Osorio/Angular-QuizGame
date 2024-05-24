import { Component, Inject, OnInit } from '@angular/core';
import { Question, QuestionForm } from '../../models/question';
import { FormArray, FormGroup, FormBuilder, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { NgFor, formatDate } from '@angular/common';
import { Answer, AnswerForm } from '../../models/answer';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { QuestionsService } from '../../services/questions.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-question-dialog',
  standalone: true,
  imports: [
    NgFor,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './question-dialog.component.html',
  styleUrl: './question-dialog.component.css'
})
export class QuestionDialogComponent{

  form : FormGroup<QuestionForm>;
  updateSuccessful : boolean = false;
  errorMessage: string = '';

  constructor(
    private questionsService: QuestionsService,
    public dialogRef: MatDialogRef<QuestionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public question: Question
  ) {
    let incorrectAnswersGroup: FormGroup<AnswerForm>[] = [];
    this.question.incorrectAnswers.forEach((answer) => {
      incorrectAnswersGroup.push(
        new FormGroup<AnswerForm>({
          id: new FormControl<number|null>(answer.id),
          answerText: new FormControl<string|null>(answer.answerText),
          answerImage: new FormControl<string|null>(answer.answerImage),
        })
      )
    })

    console.log(incorrectAnswersGroup)

    this.form = new FormGroup<QuestionForm>({
      id: new FormControl<number|null>(this.question.id),
      questionText: new FormControl<string|null>(this.question.questionText),
      questionImage: new FormControl<string|null>(this.question.questionImage),
      secondsTimeout: new FormControl<number|null>(this.question.secondsTimeout),
      relativeScore: new FormControl<number|null>(this.question.relativeScore),
      category: new FormControl<string|null>(this.question.category),
      createdAt: new FormControl<string|null>(formatDate(this.question.createdAt, 'yyyy-MM-ddTHH:mm', 'en')),
      correctAnswer: new FormGroup<AnswerForm>({
        id: new FormControl<number|null>(this.question.correctAnswer.id),
        answerText: new FormControl<string|null>(this.question.correctAnswer.answerText),
        answerImage: new FormControl<string|null>(this.question.correctAnswer.answerImage),
      }),
      incorrectAnswers: new FormArray<FormGroup<AnswerForm>>(incorrectAnswersGroup),
    });

    this.question.incorrectAnswers.forEach((answer) => {
      this.form.value.incorrectAnswers?.push(
        {
          id: answer.id,
          answerText: answer.answerText,
          answerImage: answer.answerImage,
        }
      )
    });
  }

  addWrongAnswer() {
    this.form.controls.incorrectAnswers.push(
      new FormGroup<AnswerForm>({
        id: new FormControl<number|null>(0),
        answerText: new FormControl<string|null>(''),
        answerImage: new FormControl<string|null>(''),
      })
    );
  }

  updateQuestion(){
    this.questionsService.updateQuestion(this.question).subscribe(resp => {
      console.log(resp)
      if(typeof resp == 'boolean'){
        this.updateSuccessful = resp; 
      }
      else if ( typeof resp == 'string'){
        this.updateSuccessful = false;
        this.errorMessage = resp;
      }
      else {
        this.updateSuccessful = false;
        this.errorMessage = "Unkown Error";
      }
    })
  }

  removeWrongAnswer() {
    this.form.controls.incorrectAnswers.removeAt(-1)
  }

  submitForm(){
    if(this.form.valid){
      this.question = Object.assign(this.form.value);
      this.question.createdAt = new Date(Date.now())
      this.updateQuestion()
    }
  }
}
