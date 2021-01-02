/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { Message } from '../types'
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private apiBaseUrl = environment.apiBaseUrl

  constructor(private http: HttpClient) {}

  getMessages(roomId: number): Observable<Message[]> {
    return this.http
      .get<Message[]>(`${this.apiBaseUrl}/messages/${roomId}`)
      .pipe(catchError(this.handleError('getMessages', [])))
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error)
      console.log(`${operation} failed: ${error.message}`)
      return of(result as T)
    }
  }
}
