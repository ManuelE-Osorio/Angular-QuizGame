import { Component } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    MatTabsModule,
    RouterLink,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {

}
