import { Component, Inject, OnInit } from '@angular/core';
import { Question, QuestionForm } from '../../models/question';
import { FormArray, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { formatDate } from '@angular/common';
import { Answer, AnswerForm } from '../../models/answer';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-question-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './question-dialog.component.html',
  styleUrl: './question-dialog.component.css'
})
export class QuestionDialogComponent implements OnInit{

  form = new FormGroup<QuestionForm>({
    id: new FormControl<number|null>(0),
    questionText: new FormControl<string|null>(''),
    questionImage: new FormControl<string|null>(''),
    secondsTimeout: new FormControl<number|null>(5),
    relativeScore: new FormControl<number|null>(1),
    category: new FormControl<string|null>(''),
    createdAt: new FormControl<string|null>(''),
    correctAnswer: new FormGroup<AnswerForm>({
      id: new FormControl<number|null>(0),
      answerText: new FormControl<string|null>(''),
      answerImage: new FormControl<string|null>(''),
    }),
    incorrectAnswers: new FormArray<FormGroup<AnswerForm>>(
      [
        new FormGroup<AnswerForm>({
          id: new FormControl<number|null>(0),
          answerText: new FormControl<string|null>(''),
          answerImage: new FormControl<string|null>(''),
        })
      ]),
  });

  constructor(
    public dialogRef: MatDialogRef<QuestionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public question: Question
  ) {}

  ngOnInit() {  
    this.question.incorrectAnswers.forEach((answer) => {
      this.form.value.incorrectAnswers?.push(
        {
          id: answer.id,
          answerText: answer.answerText,
          answerImage: answer.answerImage,
        }
      )
    })

    console.log(this.form)
  }

  addWrongAnswer() {

  }
}
