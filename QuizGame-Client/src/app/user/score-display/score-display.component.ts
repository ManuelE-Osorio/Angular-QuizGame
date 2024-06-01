import { Component, Input } from '@angular/core';
import { GameScore } from '../../models/score';
import { Route, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-score-display',
  standalone: true,
  imports: [
    DatePipe
  ],
  templateUrl: './score-display.component.html',
  styleUrl: './score-display.component.css'
})
export class ScoreDisplayComponent {

  @Input({required: true}) score?: GameScore;

  constructor(
    private router: Router
  ) {}

  pendingGames(){
    this.router.navigate(['user']);
  }
}
