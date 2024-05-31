import { Component, Input } from '@angular/core';
import { GameScore } from '../../models/score';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-score-display',
  standalone: true,
  imports: [],
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
