import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as socketIO from 'socket.io-client';
import { Room } from '../types';

const API_ENDPOINT = 'http://localhost:3000';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private socket: socketIO.Socket;

  constructor(private http: HttpClient) {
    this.socket = socketIO.io(API_ENDPOINT, { transports: ['websocket'] });
  }

  getRooms(): Observable<Room[]> {
    return this.http
      .get<Room[]>(`${API_ENDPOINT}/rooms`)
      .pipe(catchError(this.handleError('getRooms', [])));
  }

  getRoom(id: number): Observable<Room> {
    return this.http
      .get<Room>(`${API_ENDPOINT}/rooms/${id}`)
      .pipe(catchError(this.handleError<Room>(`getRoom  id=${id}`)));
  }

  newRoom(): Observable<Room> {
    return this.http
      .post<Room>(`${API_ENDPOINT}/rooms`, [])
      .pipe(catchError(this.handleError<Room>(`postRoom`)));
  }

  on(key: string, func: (data: number[][]) => void): void {
    this.socket.on(key, func);
  }

  emit(key: string, value: number[][]): void {
    this.socket.emit(key, value);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
