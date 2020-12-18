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

  connect(player: Player): void {
    this.socket = socketIO.io(`${API_ENDPOINT}`, {
      transports: ['websocket'],
      query: player,
    });
  }

  on(key: string, func: (data: number[][]) => void): void {
    this.socket.on(key, func);
  }

  emit(key: string, value: number[][]): void {
    this.socket.emit(key, value);
  }
}
