import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Player } from '../types';
import { API_ENDPOINT } from '../endpoints';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  constructor(private http: HttpClient) {}

  createPlayer(player: Player): Observable<Player> {
    return this.http
      .post<Player>(`${API_ENDPOINT}/players`, player)
      .pipe(catchError(this.handleError<Player>(`postPlayer`)));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
