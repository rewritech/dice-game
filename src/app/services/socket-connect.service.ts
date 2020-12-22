import { Injectable } from '@angular/core'
import * as socketIO from 'socket.io-client'
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class SocketConnectService {
  private wsBaseUrl = environment.wsBaseUrl

  private socket: socketIO.Socket

  // constructor() {}

  connect(): void {
    this.socket = socketIO.io(this.wsBaseUrl, {
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
