import { Component } from '@angular/core';
import { GameService } from '../../../services/game.service';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Game } from '../../../models/game';
import { PageData } from '../../../models/pagedata';
import { ConfirmDeleteDialogComponent } from '../../confirm-delete-dialog/confirm-delete-dialog.component';
import { QuestionDetailsComponent } from '../../questiondetails/questiondetails.component';

@Component({
  selector: 'app-games',
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
  templateUrl: './games.component.html',
  styleUrl: './games.component.css'
})
export class GamesComponent {


  games : PageData<Game> | null = null;
  columnsToDisplay = ['id', 'name', 'options'];
  data: MatTableDataSource<Game>;
  isLoading : boolean = true;

  constructor(
    private gameService : GameService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    this.data = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.getGames(0);
  }

  getGames(startIndex: number){
    this.gameService.getAllGames(undefined, undefined, startIndex).subscribe( resp => {
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
  
  deleteGame(id: number) {
    this.gameService.deleteGame(id).subscribe( (resp) => {
      if(typeof resp == 'boolean' && resp === true){
        if(this.games != null){
          this.games.totalRecords--
          this.games.data.splice(this.games.data.findIndex( p => p.id == id),1); 
          this.data.data = this.games.data
        }
      }
      else if( typeof resp == 'string'){
        this.snackBar.open(resp, 'close', {duration: 2000})
      }
    })
  }
  
  deleteGameDialog(id: number){
    this.dialog.open(ConfirmDeleteDialogComponent, {
      enterAnimationDuration: '400',
      exitAnimationDuration: '400',
      data: 'selected game?'
    }).afterClosed().subscribe( (resp) => {
      if( resp.data === true){
        this.deleteGame(id)
      }
    });
  }
}
