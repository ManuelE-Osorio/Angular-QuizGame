import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-log-out',
  standalone: true,
  imports: [
    MatButtonModule
  ],
  templateUrl: './log-out.component.html',
  styleUrl: './log-out.component.css'
})
export class LogOutComponent {

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,    
  ) {}

  logOut() {
    this.authenticationService.logOut().subscribe( resp => {
      console.log(resp)
      if( resp.status == 200){
        this.authenticationService.isLoggedIn().subscribe();
        this.authenticationService.getAdmin().subscribe();
        this.authenticationService.getUser().subscribe();
        this.router.navigate(['/login']);
      }
    });
  }
}
