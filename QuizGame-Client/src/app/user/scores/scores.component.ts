import { Component } from '@angular/core';
import { GameScore } from '../../models/score';
import { ScoreService } from '../../services/score.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { PageData } from '../../models/pagedata';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { QuestionDetailsComponent } from '../../admin/questiondetails/questiondetails.component';

@Component({
  selector: 'app-scores',
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
  templateUrl: './scores.component.html',
  styleUrl: './scores.component.css'
})
export class ScoresComponent {
  scores : PageData<GameScore> | null = null;
  columnsToDisplay = ['gameName', 'score', 'resultDate'];
  data: MatTableDataSource<GameScore>;
  isLoading : boolean = true;

  constructor(
    private scoreService : ScoreService,
    private router: Router,
  ) {
    this.data = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.getScores(0);
  }

  getScores(startIndex: number){
    this.scoreService.getAllScores().subscribe( resp => {
      if( resp != null) {
        this.data.data = resp.data
        this.scores = resp;
        this.isLoading = false;
      }
    });
  }

  onChangePage(event: PageEvent) {
    this.isLoading = true;
    this.getScores(event.pageIndex*event.pageSize); 
  }
}
