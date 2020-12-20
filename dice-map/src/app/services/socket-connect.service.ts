import { Injectable } from '@angular/core';
import * as socketIO from 'socket.io-client';
import { API_ENDPOINT } from '../endpoints';
import { Player } from '../types';

@Injectable({
  providedIn: 'root',
})
export class SocketConnectService {
  private socket: socketIO.Socket;

  // constructor() {}

  connect(): void {
    this.socket = socketIO.io(`${API_ENDPOINT}/dice-map-room`, {
      transports: ['websocket'],
    });
  }

  on<T>(key: string, func: (value: T) => void): void {
    this.socket.on(key, func);
  }

  emit<T>(key: string, value: T): void {
    this.socket.emit(key, value);
  }
}
