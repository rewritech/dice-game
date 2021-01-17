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
  private NEW_DECK = 4
  private ADD_DECK = 2

  constructor(private http: HttpClient) {}

  // API CALL =================================================
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

  addPlayerToRoom(roomId: number, player: Player): Observable<Room> {
    return this.http
      .put<Room>(`${this.apiBaseUrl}/rooms/${roomId}`, player)
      .pipe(catchError(this.handleError<Room>(`add player to room `)))
  }

  deleteRoom(room: Room): Observable<Room> {
    return this.http
      .delete<Room>(`${this.apiBaseUrl}/rooms/${room._id}`)
      .pipe(catchError(this.handleError<Room>(`deleteRoom`)))
  }

  // FOR PLAY-ROOM =================================================
  checkMyTurn(player: Player, room: Room): boolean {
    try {
      return player._id === room.currentPlayer
    } catch {
      return false
    }
  }

  // 말 선택한 플레이어 수가 2명 이상일 경우
  // 내가 선택했는지
  checkReadyToStart(room: Room): boolean {
    const currentPlayer = room.players.find((p) => p._id === room.currentPlayer)
    return (
      room.players.filter((p) => p.coordinates).length > 1 &&
      !!currentPlayer.coordinates
    )
  }

  // 내턴 && 말 선택 플레이어 2명 이상
  checkCanStart(player: Player, room: Room): boolean {
    return this.checkMyTurn(player, room) && this.checkReadyToStart(room)
  }

  // 1. room이 존재함
  // 2. 이미 방에 속한 플레이어 인 경우
  // 3. 방에 빈자리가 있는 경우
  canJoinRoom(room: Room, playerId: string): boolean {
    return (
      room &&
      room.status === 'WAIT' &&
      (room.players.filter((p) => p._id === playerId).length === 1 ||
        room.players.length < room.playerLimit)
    )
  }

  // 다음 플레이어를 가져온다. 배열의 마지막이면 초기로 돌아온다
  getNextPlayer(room: Room): string {
    const { players, currentPlayer } = room
    const index = players.findIndex((p) => p._id === currentPlayer) + 1
    const nextIndex = index === players.length ? 0 : index
    return players[nextIndex]._id
  }

  distributeCard(room: Room): Room {
    const nRoom = { ...room }
    // unused에 카드가 2장 미만이면 used의 카드를 다시 가져온다.
    if (nRoom.cardDeck.unused.length < this.ADD_DECK) {
      nRoom.cardDeck.unused = nRoom.cardDeck.unused.concat(nRoom.cardDeck.used)
      nRoom.cardDeck.used = []
    }

    const nextPlayer = nRoom.players.find((p) => p._id === nRoom.currentPlayer)
    const newCards = nRoom.cardDeck.unused.splice(0, this.ADD_DECK)
    newCards.reverse()
    newCards.forEach((c) => nextPlayer.cards.unshift(c))

    return nRoom
  }

  newDeckNum(): number {
    return this.NEW_DECK
  }

  addDeckNum(): number {
    return this.ADD_DECK
  }

  // PRIVATE =================================================
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error)
      console.log(`${operation} failed: ${error.message}`)
      return of(result as T)
    }
  }
}
