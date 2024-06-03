import { Injectable } from '@angular/core';
import { Account } from '../models/account';
import { BehaviorSubject, Observable, Subject, asyncScheduler, catchError, map, scheduled, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private _authStateChanged: Subject<boolean> = new BehaviorSubject<boolean>(false);
  private _accountInfo: Subject<Account | null> = new BehaviorSubject<Account | null>(null);
  private _isAdmin: Subject<boolean> = new BehaviorSubject<boolean>(false);
  private _isUser: Subject<boolean> = new BehaviorSubject<boolean>(false);


  constructor(
    public http : HttpClient,
  ) { }

  public onStateChanged() {
    return this._authStateChanged.asObservable();
  }

  public accountInfo() {
    return this._accountInfo.asObservable();
  }

  public isAdmin() {
    return this._isAdmin.asObservable();
  }

  public isUser() {
    return this._isUser.asObservable();
  }

  public logIn(account: Account) : Observable<boolean> {
    return this.http.post<any | null>(`/login?useCookies=true`, account, {
      observe: 'response'
    }).pipe(
      tap( {next: () => console.log(`Logged in succesfully`)}),
      catchError( () => scheduled([null], asyncScheduler)),
      map( (res) => {
        if(res != null && res.status == 200){
          this._authStateChanged.next(true);
          this.getInfo().subscribe();
          return true;
        }
        return false;
    }));
  }

  public register(account: Account) : Observable<boolean> {
    return this.http.post<boolean>(`/register`, account, {
      observe: 'response'
    }).pipe(
      tap( {next: () => console.log(`Account creation succesful`)}),
      catchError( () => scheduled([null], asyncScheduler)),
      map( (res) => {
        if( res != null && res.status == 200){
         return true;
        }
        return false;
    }));
  }

  public logOut() : Observable<any> {
    return this.http.post<any>(`/logout`, {}, {
      withCredentials: true,
      observe: 'response',
      responseType: 'json'
    }).pipe(
      tap( {next: () => console.log(`Logged out succesfully`)}),
      catchError( () => scheduled([null], asyncScheduler)),
      map( (res) => {
        if(res != null && res.status == 200){
          this._authStateChanged.next(false);
        }
        return res;
      })
    );    
  }

  public isLoggedIn() : Observable<boolean> {
    return this.http.get<Account | null >('/manage/info', {
      withCredentials: true,
      responseType: 'json'
    }).pipe(
      tap( {next: () => console.log(`User is logged in`)}),
      catchError( () => scheduled([null], asyncScheduler) ),
      map((resp) => {
        if( resp!= null && resp.email.length > 0 ){
            this._authStateChanged.next(true);
            return true;
          }
        this._authStateChanged.next(false);
        return false;
      })
    );
  }

  public getInfo() : Observable<Account | null> {
    return this.http.get<Account | null>('/manage/info', {
      withCredentials: true,
      responseType: 'json'
    }).pipe(
      tap( {next: () => console.log('Fetching user data')}),
      catchError( () => scheduled([null], asyncScheduler)),
      map( (res) => {   
        this._accountInfo.next(res);
        return res
      })
    )
  }

  public getAdmin() : Observable<boolean> {
    return this.http.get<boolean>('/adminrole', {
      withCredentials: true,
      responseType: 'json'
    }).pipe(
      tap( {next: () => console.log(`Admin Request`)}),
      catchError( () => scheduled([false], asyncScheduler)),
      map( (res) => {     
        this._isAdmin.next(res);
        return res
      })      
    )
  }

  public getUser() : Observable<boolean> {
    return this.http.get<boolean>('/userrole', {
      withCredentials: true,
      responseType: 'json'
    }).pipe(
      tap( {next: () => console.log(`User Request`)}),
      catchError( () => scheduled([false], asyncScheduler)),
      map( (res) => {     
        this._isUser.next(res);
        return res
      })      
    )
  }
}
