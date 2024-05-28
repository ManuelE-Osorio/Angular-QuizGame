import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, scheduled, asyncScheduler } from 'rxjs';
import { PageData } from '../models/pagedata';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = "/api/users";
  constructor(
    private http: HttpClient,
  ) { }

  getAllUsers(startIndex?: number) : Observable<PageData<User> | null> {
    
    let options = new HttpParams();
    
    options = startIndex? options.set('startIndex', startIndex) : options;
  
    return this.http.get<PageData<User>>(`${this.baseUrl}`, {
      responseType: 'json',
      withCredentials: true,
      params: options
    }).pipe(
      tap( {next: () => console.log(`Items fetched succesfully`)}),
      catchError( () => scheduled([null], asyncScheduler))
    );
  }
}