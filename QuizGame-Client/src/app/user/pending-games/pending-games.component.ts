import { CommonModule, DatePipe, DatePipeConfig } from '@angular/common';
import { Component, InjectionToken } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { ConfirmDeleteDialogComponent } from '../../admin/confirm-delete-dialog/confirm-delete-dialog.component';
import { QuestionDetailsComponent } from '../../admin/questiondetails/questiondetails.component';
import { Game } from '../../models/game';
import { PageData } from '../../models/pagedata';
import { GameService } from '../../services/game.service';
import { GameSessionService } from '../../services/game-session.service';

@Component({
  selector: 'app-pending-games',
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
  templateUrl: './pending-games.component.html',
  styleUrl: './pending-games.component.css'
})
export class PendingGamesComponent {
  games : PageData<Game> | null = null;
  columnsToDisplay = ['name', 'dueDate', 'options'];
  data: MatTableDataSource<Game>;
  isLoading : boolean = true;

  constructor(
    private gameService : GameService,
    public dialog: MatDialog,
    public gameSessionService: GameSessionService,
    private router: Router,
  ) {
    this.data = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.getGames(0);
  }

  getGames(startIndex: number){
    this.gameService.getPendingGames(startIndex).subscribe( resp => {
      if( resp != null) {
        this.data.data = resp.data
        this.games = resp;
        this.isLoading = false;
      }
    });
  }

  onChangePage(event: PageEvent) {
    this.isLoading = true;
    this.getGames(event.pageIndex*event.pageSize); 
  }

  startGameSession(id: number) {
    this.gameSessionService.loadQuestions(id);
    this.router.navigate([`user/gamesession/${id}`]);
  }
}

