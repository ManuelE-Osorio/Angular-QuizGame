import { Component } from '@angular/core';
import { QuestionsComponent } from '../questions/questions.component';
import {MatGridListModule} from '@angular/material/grid-list';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    RouterLink,
    QuestionsComponent,
    MatGridListModule
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

}
