/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { Player, Room } from '../types'
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private apiBaseUrl = environment.apiBaseUrl

  constructor(private http: HttpClient) {}

  getRooms(): Observable<Room[]> {
    return this.http
      .get<Room[]>(`${this.apiBaseUrl}/rooms`)
      .pipe(catchError(this.handleError('getRooms', [])))
  }

  getRoom(id: number): Observable<Room> {
    return this.http
      .get<Room>(`${this.apiBaseUrl}/rooms/${id}`)
      .pipe(catchError(this.handleError<Room>(`getRoom id=${id}`)))
  }

  createRoom(room: Room): Observable<Room> {
    return this.http
      .post<Room>(`${this.apiBaseUrl}/rooms`, room)
      .pipe(catchError(this.handleError<Room>(`postRoom`)))
  }

  addPlayerToRoom(player: Player): Observable<Room> {
    return this.http
      .put<Room>(`${this.apiBaseUrl}/rooms/${player._roomId}`, player)
      .pipe(catchError(this.handleError<Room>(`add player to room `)))
  }

  deleteRoom(room: Room): Observable<Room> {
    return this.http
      .delete<Room>(`${this.apiBaseUrl}/rooms/${room._id}`)
      .pipe(catchError(this.handleError<Room>(`deleteRoom`)))
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error)
      console.log(`${operation} failed: ${error.message}`)
      return of(result as T)
    }
  }
}
