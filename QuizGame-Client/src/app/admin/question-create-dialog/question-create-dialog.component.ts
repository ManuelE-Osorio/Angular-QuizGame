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
  selector: 'app-question-create-dialog',
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
  templateUrl: './question-create-dialog.component.html',
  styleUrl: './question-create-dialog.component.css'
})
export class QuestionCreateDialogComponent {

  form : FormGroup<QuestionForm>;
  createdSuccessful : boolean = false;
  errorMessage: string = '';

  constructor(
    private questionsService: QuestionsService,
    public dialogRef: MatDialogRef<QuestionCreateDialogComponent>,
  ) {
    this.form = new FormGroup<QuestionForm>({
      questionText: new FormControl<string|null>(''),
      questionImage: new FormControl<string|null>(''),
      secondsTimeout: new FormControl<number|null>(5),
      relativeScore: new FormControl<number|null>(1),
      category: new FormControl<string|null>(''),
      createdAt: new FormControl<string|null>(''),
      correctAnswer: new FormGroup<AnswerForm>({
        answerText: new FormControl<string|null>(''),
        answerImage: new FormControl<string|null>(''),
      }),
      incorrectAnswers: new FormArray<FormGroup<AnswerForm>>([
        new FormGroup<AnswerForm>({
          answerText: new FormControl<string|null>(''),
          answerImage: new FormControl<string|null>(''),
        }),
      ]),
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

  createQuestion(question: Question){
    this.questionsService.createQuestion(question).subscribe( (resp) => {
      if(typeof resp == 'number'){
        this.createdSuccessful = true;
        question.id = resp
        this.dialogRef.close({data: question});
      }
      else if (typeof resp == 'string'){
        this.createdSuccessful = false;
        this.errorMessage = resp;
      }
    })
  }

  removeWrongAnswer() {
    this.form.controls.incorrectAnswers.removeAt(-1)
  }

  submitForm(){
    if(this.form.valid){
      let question : Question;
      question = Object.assign(this.form.value);
      question.createdAt = new Date(Date.now())
      this.createQuestion(question)
    }
  }
}
