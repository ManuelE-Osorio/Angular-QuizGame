import { Component, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { LogOutComponent } from '../log-out/log-out.component';
import { RouterLink } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { Subscription } from 'rxjs';
import { Account } from '../../models/account';

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
export class AuthenticationComponent implements OnDestroy{
  isLoggedIn: boolean = false;
  UserInfo: Account | null = null;
  accountInfoSubscription: Subscription;
  loggedInSubscription: Subscription;

  constructor(
    private authenticationService: AuthenticationService,
  ) {
    this.authenticationService.isLoggedIn().subscribe();
    this.authenticationService.getInfo().subscribe();
    this.accountInfoSubscription = this.authenticationService.accountInfo().subscribe( resp => this.UserInfo = resp);
    this.loggedInSubscription = this.authenticationService.onStateChanged().subscribe( resp => this.isLoggedIn = resp);
  }

  ngOnDestroy(): void {
    this.accountInfoSubscription.unsubscribe();
    this.loggedInSubscription.unsubscribe();
  }
}
