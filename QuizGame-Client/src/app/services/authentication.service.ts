import { Injectable } from '@angular/core';
import { Account } from '../models/account';
import { Observable, asyncScheduler, catchError, map, scheduled, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    public http : HttpClient,
  ) { }

  public logIn(account: Account) : Observable<boolean> {
    return this.http.post<any | null>(`/login?useCookies=true`, account, {
      observe: 'response'
    }).pipe(
      tap( {next: () => console.log(`Logged in succesfully`)}),
      catchError( () => scheduled([null], asyncScheduler)),
      map( (res) => {
        if(res != null && res.status == 200){
          return true;
        }
        return false;
    }));
  }
}
