import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Question } from '../models/question';
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

  // private log(message: string, type: string) {
  //   this.notificationService.add( message, type);
  // }

  // private logError(){
  //   return (error: any): Observable<null> => {
  //     this.log(`Unable to complete operation, please try again later. Error code: ${error.status}`, 'error');
  //     return scheduled([null], asyncScheduler);
  //   };
  // }
}
