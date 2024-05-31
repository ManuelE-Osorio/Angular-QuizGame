import { HttpClient, HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Question, QuestionForGame } from '../models/question';
import { PageData } from '../models/pagedata';
import { formatDate } from '@angular/common';
import { Observable, tap, catchError, map, scheduled, asyncScheduler } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  private baseUrl = "/api/questions";
  constructor(
    private http: HttpClient,
  ) { }

  getAllQuestions(category?: string, date?: string, startIndex?: number) : Observable<PageData<Question> | null> {
    
    let options = new HttpParams();
    
    options = category? options.set('category', category) : options;
    options = date? options.set('date', date) : options;
    options = startIndex? options.set('startIndex', startIndex) : options;

    return this.http.get<PageData<Question>>(`${this.baseUrl}`, {
      responseType: 'json',
      withCredentials: true,
      params: options
    }).pipe(
      tap( {next: () => console.log(`Items fetched succesfully`)}),
      catchError( () => scheduled([null], asyncScheduler)),
      map( (resp) => {
        if( resp != null) {
          return {
          data : resp.data.map( question => {
            question.createdAt = new Date(question.createdAt);
            return question; }),
          currentPage : resp.currentPage,
          pageSize: resp.pageSize,
          totalPages: resp.totalPages,
          totalRecords: resp.totalRecords}
        }
        return null;  
      }),
    );
  }

  getQuestion(id: number) : Observable<Question | null> {
    return this.http.get<Question>(`${this.baseUrl}/${id}`, {
      responseType: 'json',
      withCredentials: true,
    }).pipe(
      tap( {next: () => console.log(`Items fetched succesfully`)}),
      catchError( () => scheduled([null], asyncScheduler)),
      map( (resp) => {
        if( resp != null) {
          resp.createdAt = new Date(resp.createdAt);
          return resp; 
        }
        return null;
      }),
    );
  }

  getQuestionsByGame(id: number) : Observable<QuestionForGame[] | null> {
    return this.http.get<QuestionForGame[]>(`${this.baseUrl}/game/${id}`, {
      responseType: 'json',
      withCredentials: true,
    }).pipe(
      tap( {next: () => console.log(`Items fetched succesfully`)}),
      catchError( () => scheduled([null], asyncScheduler))
    );
  }

  createQuestion(question: Question) : Observable<number | string> {
    return this.http.post<number | string>(`${this.baseUrl}`, question, {
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

  updateQuestion(question: Question) : Observable<boolean | string> {
    return this.http.put<boolean | string>(`${this.baseUrl}/${question.id}`, question, {
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

  deleteQuestion(id: number) : Observable<boolean | string> {
    return this.http.delete<boolean | string>(`${this.baseUrl}/${id}`, {
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
