import { Component, OnInit} from '@angular/core';
import { Question } from '../../models/question';
import { PageData } from '../../models/pagedata';
import { QuestionsService } from '../../services/questions.service';
import { NgFor, NgIf, DatePipe} from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { QuestionDetailsComponent } from '../questiondetails/questiondetails.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatDialog } from '@angular/material/dialog';
import { QuestionCreateDialogComponent } from '../question-create-dialog/question-create-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatProgressBarModule} from '@angular/material/progress-bar'
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    QuestionDetailsComponent,
    MatExpansionModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatProgressBarModule,
    DatePipe,
    RouterLink,
  ],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.css'
})
export class QuestionsComponent implements OnInit{

  questions : PageData<Question> | null = null;
  columnsToDisplay = ['id', 'questionText', 'correctAnswer', 'createdAt', 'options'];
  data: MatTableDataSource<Question>;
  isLoading : boolean = true;
  
  constructor(
    private questionsService : QuestionsService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    this.data = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.getQuestions(0);
  }

  getQuestions(startIndex: number){
    this.questionsService.getAllQuestions(undefined, undefined, startIndex).subscribe( resp => {
      if( resp != null) {
        this.data.data = resp.data
        this.questions = resp;
        this.isLoading = false;
      }
    });
  }

  onChangePage(event: PageEvent) {
    this.isLoading = true;
    this.getQuestions(event.pageIndex*event.pageSize); 
  }

  addQuestion(question: Question){
    if(this.questions?.data != null){
      this.questions.totalRecords = this.questions.totalRecords + 1; 
      if(this.questions.data.length < 5 && question.id >= this.questions.data.at(-1)!.id){
        this.questions.data.push(question)
      }
    }
  }

  newQuestion() {
    this.dialog.open(QuestionCreateDialogComponent, {
      enterAnimationDuration: '400',
      exitAnimationDuration: '400',
    }).afterClosed().subscribe( (response) => {
      this.addQuestion(response.data)
    });
  }

  deleteQuestion(id: number) {
    this.questionsService.deleteQuestion(id).subscribe( (resp) => {
      if(typeof resp == 'boolean' && resp === true){
        if(this.questions != null){
          this.questions.totalRecords--
          this.questions.data.splice(this.questions.data.findIndex( p => p.id == id),1); 
          this.data.data = this.questions.data
        }
      }
      else if( typeof resp == 'string'){
        this.snackBar.open(resp, 'close', {duration: 2000})
      }
    })
  }
  

  deleteQuestionDialog(id: number){
    this.dialog.open(ConfirmDeleteDialogComponent, {
      enterAnimationDuration: '400',
      exitAnimationDuration: '400',
      data: 'selected question?'
    }).afterClosed().subscribe( (resp) => {
      console.log(resp)
      if( resp.data === true){
        this.deleteQuestion(id)
      }
    });
  }
}
