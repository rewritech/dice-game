import { Injectable } from '@angular/core'
import * as socketIO from 'socket.io-client'
import { environment } from '../../environments/environment'
import { Player } from '../types'

@Injectable({
  providedIn: 'root',
})
export class SocketConnectService {
  private apiBaseUrl = environment.apiBaseUrl

  private socket: socketIO.Socket

  // constructor() {}

  connect(): void {
    this.socket = socketIO.io(`${this.apiBaseUrl}/dice-map-room`, {
      transports: ['websocket'],
    })
  }

  on<T>(key: string, func: (value: T) => void): void {
    this.socket.on(key, func)
  }

  emit<T>(key: string, value: T): void {
    this.socket.emit(key, value)
  }
}
