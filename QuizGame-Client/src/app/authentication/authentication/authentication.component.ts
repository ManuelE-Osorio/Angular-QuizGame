import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { LogOutComponent } from '../log-out/log-out.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule,
    LogOutComponent
  ],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.css'
})
export class AuthenticationComponent {
  isLoggedIn: boolean = false;
}
