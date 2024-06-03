import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Account, AccountForm } from '../../models/account';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css'
})
export class LogInComponent {
  isLoggedIn: boolean = false;
  
  form : FormGroup<AccountForm> = new FormGroup<AccountForm>({
    email: new FormControl<string>('', {nonNullable: true, validators: [
      Validators.required, Validators.email
    ]}),
    password: new FormControl<string>('', {nonNullable: true, validators: [
      Validators.required
    ]})
  });

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,  
  ) {}

  logIn(account: Account){
    this.authenticationService.logIn(account).subscribe( resp => {
      if( resp == true){
        this.isLoggedIn = true;
        this.authenticationService.isLoggedIn().subscribe();
        this.authenticationService.getAdmin().subscribe();
        this.authenticationService.getUser().subscribe();
        this.router.navigate([''])
      }
      else{
        this.isLoggedIn = false;
      }
    })
  }

  submitForm(){
    if(this.form.valid){
      let account: Account ;
      account = Object.assign(this.form.value);
      this.logIn(account);
    }
  }

  ngOnInit(): void {
    this.authenticationService.isLoggedIn()
      .subscribe( resp => this.isLoggedIn = resp)
  }
}
