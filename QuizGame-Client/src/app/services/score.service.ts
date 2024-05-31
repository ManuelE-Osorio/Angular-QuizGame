import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, scheduled, asyncScheduler, map } from 'rxjs';
import { Game } from '../models/game';
import { PageData } from '../models/pagedata';
import { GameScore } from '../models/score';
import { Answer } from '../models/answer';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  private baseUrl = "/api/scores";
  constructor(
    private http: HttpClient,
  ) { }

  getAllScores(game?: string, date?: string, startIndex?: number) : Observable<PageData<GameScore> | null> {
    
    let options = new HttpParams();
    
    options = game? options.set('game', game) : options;
    options = date? options.set('date', date) : options;
    options = startIndex? options.set('startIndex', startIndex) : options;
  
    return this.http.get<PageData<GameScore>>(`${this.baseUrl}`, {
      responseType: 'json',
      withCredentials: true,
      params: options
    }).pipe(
      tap( {next: () => console.log(`Items fetched succesfully`)}),
      catchError( () => scheduled([null], asyncScheduler)),
      map( (resp) => {
        if( resp != null) {
          resp.data = resp.data.map( result => {
            result.resultDate = new Date(result.resultDate);
            return result
          });
          return resp;
        }
        return null;  
      })
    );
  }

  getScore(id: number) : Observable<GameScore | null> {
    return this.http.get<GameScore>(`${this.baseUrl}/${id}`, {
      responseType: 'json',
      withCredentials: true,
    }).pipe(
      tap( {next: () => console.log(`Items fetched succesfully`)}),
      catchError( () => scheduled([null], asyncScheduler)),
      map( (resp) => {
        if( resp != null) {
          resp.resultDate = new Date(resp.resultDate);
          return resp; 
        }
        return null;
      }),
    );
  }

  createScore(gameId: number, answers: Answer[]) : Observable<GameScore | string> {
    let options = new HttpParams();
    options = gameId? options.set('gameId', gameId) : options;
    
    return this.http.post<number | string>(`${this.baseUrl}`, answers, {
      responseType: 'json',
      withCredentials: true,
      observe: 'response',
      params: options
    }).pipe(
      tap( {next: () => console.log(`Items created succesfully`)}),
      catchError( (resp) => scheduled([resp.error], asyncScheduler)),
      map( (resp) => {
        if( resp.status == 201) {
          resp.body.resultDate = new Date(resp.body.resultDate);
          return resp.body; 
        }
        return null;
      }),
    );
  }

  updateScore(score: GameScore) : Observable<boolean | string> {
    return this.http.put<boolean | string>(`${this.baseUrl}/${score.id}`, score, {
      responseType: 'json',
      withCredentials: true,
      observe: 'response'
    }).pipe(
      tap( {next: () => console.log(`Items updated succesfully`)}),
      catchError( (resp) => scheduled([resp.error], asyncScheduler)),
      map( (resp) => {
        if( resp.status == 200) {
          return true;
        }
        return resp;
      }),
    );
  }

  deleteScore(id: number) : Observable<boolean | string> {
    return this.http.delete<boolean | string>(`${this.baseUrl}/${id}`, {
      responseType: 'json',
      withCredentials: true,
      observe: 'response'
    }).pipe(
      tap( {next: () => console.log(`Score deleted succesfully`)}),
      catchError( (resp) => scheduled([resp.error], asyncScheduler)),
      map( (resp) => {
        if( resp.status == 200) {
          return true
        }
        return resp;
      }),
    );
  }
}

