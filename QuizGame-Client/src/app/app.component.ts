import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthenticationComponent } from './authentication/authentication/authentication.component';
import { Subscription } from 'rxjs';
import { AuthenticationService } from './services/authentication.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink, 
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    AuthenticationComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'QuizGame-Client';
  adminSubscription : Subscription;
  loggedInSubscription : Subscription;
  userSubscription : Subscription;
  isLoggedIn : boolean = false;
  isAdmin : boolean = false;
  isUser : boolean = false;

  constructor(
    iconRegistry: MatIconRegistry, 
    sanitizer: DomSanitizer,
    private authenticationService: AuthenticationService,
  ) 
  {
    iconRegistry.addSvgIcon('github', sanitizer.bypassSecurityTrustResourceUrl('../assets/svg/github.svg'));
    iconRegistry.addSvgIcon('linkedin', sanitizer.bypassSecurityTrustResourceUrl('../assets/svg/linkedin.svg'));
    this.authenticationService.isLoggedIn().subscribe();
    this.authenticationService.getAdmin().subscribe();
    this.authenticationService.getUser().subscribe();
    this.loggedInSubscription = this.authenticationService.onStateChanged().subscribe( resp => this.isLoggedIn = resp);
    this.adminSubscription = this.authenticationService.isAdmin().subscribe( resp => this.isAdmin = resp);
    this.userSubscription = this.authenticationService.isUser().subscribe( resp => this.isUser = resp);
  }
}
