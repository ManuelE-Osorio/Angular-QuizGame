import { Component, Input, input } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { Question } from '../../models/question';
import { MatDividerModule } from '@angular/material/divider';
import { MatButton } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDialog } from '@angular/material/dialog';
import { QuestionDialogComponent } from '../question-dialog/question-dialog.component';

@Component({
  selector: 'app-questiondetails',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatDividerModule,
    MatButton,
    MatListModule
  ],
  templateUrl: './questiondetails.component.html',
  styleUrl: './questiondetails.component.css'
})
export class QuestionDetailsComponent {
  @Input() question: Question | null = null;
  
  constructor(
    public logDialog: MatDialog,
  ) {}

  openDialog(question: Question){
    this.logDialog.open(QuestionDialogComponent, {
      width: '400px',
      enterAnimationDuration: '400',
      exitAnimationDuration: '400',
      data: question
    }).afterClosed();
  }


}
