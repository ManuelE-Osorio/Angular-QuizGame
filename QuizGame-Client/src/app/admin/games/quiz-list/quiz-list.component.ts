import { Component, Input } from '@angular/core';
import { MatListModule, MatSelectionListChange, MatListOption } from '@angular/material/list';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PageData } from '../../../models/pagedata';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { QuizService } from '../../../services/quiz.service';
import { Quiz } from '../../../models/quiz';

@Component({
  selector: 'app-quiz-list',
  standalone: true,
  imports: [
    MatPaginatorModule,
    MatProgressBarModule,
    MatListModule
  ],
  templateUrl: './quiz-list.component.html',
  styleUrl: './quiz-list.component.css'
})
export class QuizListComponent {

  quizzes: PageData<Quiz> | null = null;
  isLoading : boolean = true;
  
  @Input() selectedQuiz: Quiz | null = null;

  constructor(
    private quizService : QuizService,
  ) {}

  ngOnInit(): void {
    this.quizService.getAllQuizzes().subscribe( (resp) => {
      if(resp != null) {
        this.quizzes = resp;
        this.isLoading = false;
      }
    });
  }

  modifySelection(event: MatSelectionListChange){
    this.selectedQuiz = event.source.selectedOptions.selected.map((o: MatListOption) => o.value)[0];
    console.log(this.selectedQuiz)
  }

  getUsers(startIndex: number){
    this.quizService.getAllQuizzes(undefined, startIndex).subscribe( (resp) => {
      if(resp != null) {
        this.quizzes = resp;
        this.isLoading = false;
      }
    });
  }

  onChangePage(event: PageEvent){
    this.isLoading = true;
    this.getUsers(event.pageIndex*event.pageSize);
  }

  isSelected(id: number): boolean{
    if(this.selectedQuiz != null && this.selectedQuiz.id == id){
      return true;
    }
    else
      return false;
  }
}
