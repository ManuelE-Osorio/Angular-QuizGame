import { Component, OnInit} from '@angular/core';
import { Question } from '../../../models/question';
import { PageData } from '../../../models/pagedata';
import { NgFor, NgIf, DatePipe, CommonModule} from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { QuestionDetailsComponent } from '../../questiondetails/questiondetails.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatDialog } from '@angular/material/dialog';
import { QuestionCreateDialogComponent } from '../../question-create-dialog/question-create-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmDeleteDialogComponent } from '../../confirm-delete-dialog/confirm-delete-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatProgressBarModule} from '@angular/material/progress-bar'
import { RouterLink } from '@angular/router';
import { Quiz } from '../../../models/quiz';
import { QuizService } from '../../../services/quiz.service';

@Component({
  selector: 'app-quizzes',
  standalone: true,
  imports: [
    CommonModule,
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
  templateUrl: './quizzes.component.html',
  styleUrl: './quizzes.component.css'
})
export class QuizzesComponent {

  quizzes : PageData<Quiz> | null = null;
  columnsToDisplay = ['id', 'name', 'description', 'options'];
  data: MatTableDataSource<Quiz>;
  isLoading : boolean = true;

  constructor(
    private quizService : QuizService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    this.data = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.getLogs(0);
  }

  getLogs(startIndex: number){
    this.quizService.getAllQuizzes(undefined, startIndex).subscribe( resp => {
      if( resp != null) {
        this.data.data = resp.data
        this.quizzes = resp;
        this.isLoading = false;
      }
    });
  }

  onChangePage(event: PageEvent) {
    this.isLoading = true;
    this.getLogs(event.pageIndex*event.pageSize); 
  }
  
  deleteQuiz(id: number) {
    this.quizService.deleteQuiz(id).subscribe( (resp) => {
      if(typeof resp == 'boolean' && resp === true){
        if(this.quizzes != null){
          this.quizzes.totalRecords--
          this.quizzes.data.splice(this.quizzes.data.findIndex( p => p.id == id),1); 
          this.data.data = this.quizzes.data
        }
      }
      else if( typeof resp == 'string'){
        this.snackBar.open(resp, 'close', {duration: 2000})
      }
    })
  }
  
  deleteQuizDialog(id: number){
    this.dialog.open(ConfirmDeleteDialogComponent, {
      enterAnimationDuration: '400',
      exitAnimationDuration: '400',
      data: 'selected quiz?'
    }).afterClosed().subscribe( (resp) => {
      console.log(resp)
      if( resp.data === true){
        this.deleteQuiz(id)
      }
    });
  }
}
