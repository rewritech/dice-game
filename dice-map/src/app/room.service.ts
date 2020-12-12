import { Injectable } from '@angular/core';
import * as socketIO from 'socket.io-client';

const SOCKET_ENDPOINT = "http://localhost:3000";

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private socket: socketIO.Socket;

  constructor() {
    this.socket = socketIO.io(SOCKET_ENDPOINT, {transports: ['websocket']});
  }

  on(key, func) {
    this.socket.on(key, func);
  }

  emit(key, value) {
    this.socket.emit(key, value);
  }
}
