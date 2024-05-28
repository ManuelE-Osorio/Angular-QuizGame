import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Question } from '../../../models/question';
import { QuestionsService } from '../../../services/questions.service';
import { PageData } from '../../../models/pagedata';
import {MatProgressBarModule} from '@angular/material/progress-bar'
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatListModule, MatListOption, MatSelectionListChange} from '@angular/material/list';

@Component({
  selector: 'app-question-list',
  standalone: true,
  imports: [
    MatPaginatorModule,
    MatProgressBarModule,
    MatListModule
  ],
  templateUrl: './question-list.component.html',
  styleUrl: './question-list.component.css'
})
export class QuestionListComponent implements OnInit {

  questions: PageData<Question> | null = null;
  isLoading : boolean = true;
  selectedQuestions: Question[] = [];
  @Input() totalSelectedQuestions: Question[] = [];

  constructor(
    private questionService : QuestionsService,
  ) {}

  ngOnInit(): void {
    this.questionService.getAllQuestions().subscribe( (resp) => {
      if(resp != null) {
        this.questions = resp;
        this.isLoading = false;
      }
    });
  }

  modifySelection(event: MatSelectionListChange){
    this.selectedQuestions = event.source.selectedOptions.selected.map((o: MatListOption) => o.value);
    this.questions?.data.forEach( (question) => {
      if(this.totalSelectedQuestions.findIndex( value => value.id === question.id) != -1)
      {
        this.totalSelectedQuestions.splice(this.totalSelectedQuestions.findIndex( value => value.id === question.id), 1)
      }
    });

    this.totalSelectedQuestions.splice(this.totalSelectedQuestions.length+1, 0, ...this.selectedQuestions)
  }

  getQuestions(startIndex: number){
    this.questionService.getAllQuestions(undefined, undefined, startIndex).subscribe( (resp) => {
      if(resp != null) {
        this.questions = resp;
        this.isLoading = false;
      }
    });
  }

  onChangePage(event: PageEvent){
    this.isLoading = true;
    this.getQuestions(event.pageIndex*event.pageSize);
  }

  isSelected(id: number): boolean{
    if(this.totalSelectedQuestions.find( p => p.id == id) != undefined){
      return true;
    }
    else
      return false;
  }
}
