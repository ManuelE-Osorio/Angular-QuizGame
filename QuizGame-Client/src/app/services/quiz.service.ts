import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, scheduled, asyncScheduler, map } from 'rxjs';
import { PageData } from '../models/pagedata';
import { Question } from '../models/question';
import { Quiz } from '../models/quiz';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  private baseUrl = "/api/quiz";
  constructor(
    private http: HttpClient,
  ) { }

  getAllQuizzes(name?: string, startIndex?: number) : Observable<PageData<Quiz> | null> {
    
    let options = new HttpParams();
    
    options = name? options.set('name', name) : options;
    options = startIndex? options.set('startIndex', startIndex) : options;
  
    return this.http.get<PageData<Quiz>>(`${this.baseUrl}`, {
      responseType: 'json',
      withCredentials: true,
      params: options
    }).pipe(
      tap( {next: () => console.log(`Items fetched succesfully`)}),
      catchError( () => scheduled([null], asyncScheduler)),
      map( (resp) => {
        if( resp != null) {
          return resp
        }
        return null;  
      }),
    );
  }

  getQuiz(id: number) : Observable<Quiz | null> {
    return this.http.get<Quiz>(`${this.baseUrl}/${id}`, {
      responseType: 'json',
      withCredentials: true,
    }).pipe(
      tap( {next: () => console.log(`Items fetched succesfully`)}),
      catchError( () => scheduled([null], asyncScheduler)),
      map( (resp) => {
        if( resp != null) {
          return resp; 
        }
        return null;
      }),
    );
  }

  createQuiz(quiz: Quiz) : Observable<number | string> {
    return this.http.post<number | string>(`${this.baseUrl}`, quiz, {
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

  updateQuiz(quiz: Quiz) : Observable<boolean | string> {
    return this.http.put<boolean | string>(`${this.baseUrl}/${quiz.id}`, quiz, {
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

  deleteQuiz(id: number) : Observable<boolean | string> {
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

  insertQuestions(id: number, questionIdList: number[]) : Observable<boolean | string> {
    return this.http.put<boolean | string>(`${this.baseUrl}/${id}/questions`, questionIdList, {
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
