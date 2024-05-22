import { Component, OnInit } from '@angular/core';
import { Question } from '../../models/question';
import { PageData } from '../../models/pagedata';
import { QuestionsService } from '../../services/questions.service';
import { NgFor, NgIf } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { QuestionDetailsComponent } from '../questiondetails/questiondetails.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { QuestionDialogComponent } from '../question-dialog/question-dialog.component';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    QuestionDetailsComponent,
    MatExpansionModule
  ],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.css'
})
export class QuestionsComponent implements OnInit{

  questions : PageData<Question> | null = null;

  constructor(
    private questionsService : QuestionsService,
    public logDialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getLogs(0);
  }

  getLogs(startIndex: number){
    this.questionsService.getAllQuestions(undefined, undefined, startIndex).subscribe( resp => {
      if( resp != null) {
        this.questions = resp;
      }
    });
  }

  onChangePage(event: PageEvent) {
    this.getLogs(event.pageIndex*event.pageSize); 
  }
}
