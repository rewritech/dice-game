import { Injectable } from '@angular/core';
import * as socketIO from 'socket.io-client';

const SOCKET_ENDPOINT = 'http://localhost:3000';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private socket: socketIO.Socket;

  constructor() {
    this.socket = socketIO.io(SOCKET_ENDPOINT, { transports: ['websocket'] });
  }

  on(key: string, func: (data: number[][]) => void): void {
    this.socket.on(key, func);
  }

  emit(key: string, value: number[][]): void {
    this.socket.emit(key, value);
  }
}
