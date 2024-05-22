import { Component } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { QuestionsComponent } from '../questions/questions.component';
import { CommonModule, NgFor } from '@angular/common';
import { QuestionDetailsComponent } from '../questiondetails/questiondetails.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    NgFor,
    MatTabsModule,
    QuestionsComponent,
    QuestionDetailsComponent
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

}
