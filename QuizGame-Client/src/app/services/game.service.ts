import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, scheduled, asyncScheduler, map } from 'rxjs';
import { Game } from '../models/game';
import { PageData } from '../models/pagedata';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private baseUrl = "/api/game";
  constructor(
    private http: HttpClient,
  ) { }

  getAllGames(name?: string, date?: string, startIndex?: number) : Observable<PageData<Game> | null> {
    
    let options = new HttpParams();
    
    options = name? options.set('name', name) : options;
    options = date? options.set('date', date) : options;
    options = startIndex? options.set('startIndex', startIndex) : options;
  
    return this.http.get<PageData<Game>>(`${this.baseUrl}`, {
      responseType: 'json',
      withCredentials: true,
      params: options
    }).pipe(
      tap( {next: () => console.log(`Items fetched succesfully`)}),
      catchError( () => scheduled([null], asyncScheduler)),
      map( (resp) => {
        if( resp != null) {
          resp.data = resp.data.map( game => {
            game.dueDate = new Date(game.dueDate);
            return game
          });
          return resp;
        }
        return null;  
      })
    );
  }

  getGame(id: number) : Observable<Game | null> {
    return this.http.get<Game>(`${this.baseUrl}/${id}`, {
      responseType: 'json',
      withCredentials: true,
    }).pipe(
      tap( {next: () => console.log(`Items fetched succesfully`)}),
      catchError( () => scheduled([null], asyncScheduler)),
      map( (resp) => {
        if( resp != null) {
          resp.dueDate = new Date(resp.dueDate);
          return resp; 
        }
        return null;
      }),
    );
  }

  getPendingGames(startIndex: number) : Observable<PageData<Game> | null>{
    let options = new HttpParams();
    options = startIndex? options.set('startIndex', startIndex) : options;
  
    return this.http.get<PageData<Game>>(`${this.baseUrl}/pending`, {
      responseType: 'json',
      withCredentials: true,
      params: options
    }).pipe(
      tap( {next: () => console.log(`Items fetched succesfully`)}),
      catchError( () => scheduled([null], asyncScheduler)),
      map( (resp) => {
        if( resp != null) {
          resp.data = resp.data.map( game => {
            game.dueDate = new Date(game.dueDate);
            return game
          });
          return resp;
        }
        return null;  
      })
    );
  }

  createGame(game: Game) : Observable<number | string> {
    return this.http.post<number | string>(`${this.baseUrl}`, game, {
      responseType: 'json',
      withCredentials: true,
      observe: 'response'
    }).pipe(
      tap( {next: () => console.log(`Items created succesfully`)}),
      catchError( (resp) => scheduled([resp.error], asyncScheduler)),
      map( (resp) => {
        if (resp.status == 201){
          return resp.body.id;
        }
        return resp;
      })
    );
  }

  updateGame(game: Game) : Observable<boolean | string> {
    return this.http.put<boolean | string>(`${this.baseUrl}/${game.id}`, game, {
      responseType: 'json',
      withCredentials: true,
      observe: 'response'
    }).pipe(
      tap( {next: () => console.log(`Items updated succesfully`)}),
      catchError( (resp) => scheduled([resp.error], asyncScheduler)),
      map( (resp) => {
        if (resp.status == 200){
          return true;
        }
        return resp;
      })
    );
  }

  deleteGame(id: number) : Observable<boolean | string> {
    return this.http.delete<boolean | string>(`${this.baseUrl}/${id}`, {
      responseType: 'json',
      withCredentials: true,
      observe: 'response'
    }).pipe(
      tap( {next: () => console.log(`Item deleted succesfully`)}),
      catchError( (resp) => scheduled([resp.error], asyncScheduler)),
      map( (resp) => {
        if (resp.status == 200){
          return true;
        }
        return resp;
      })
    );
  }

  insertUsers(id: number, assignedUsers: string[]) : Observable<boolean | string> {
    return this.http.put<boolean | string>(`${this.baseUrl}/${id}/users`, assignedUsers, {
      responseType: 'json',
      withCredentials: true,
      observe: 'response'
    }).pipe(
      tap( {next: () => console.log(`Items created succesfully`)}),
      catchError( (resp) => scheduled([resp.error], asyncScheduler)),
      map( (resp) => {
        if (resp.status == 200){
          return true;
        }
        return resp;
      })
    );
  }
}

