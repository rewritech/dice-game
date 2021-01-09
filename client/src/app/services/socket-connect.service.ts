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
    // socket이 연결 안된 경우만 새로 연결함
    if (!this.socket?.connected) {
      this.socket = socketIO.io(this.wsBaseUrl, {
        transports: ['websocket'],
      })
    }
  }

  on<T>(key: string, func: (value: T) => void): void {
    this.socket.on(key, func)
  }

  emit<T>(key: string, value: T): void {
    this.socket.emit(key, value)
  }
}
