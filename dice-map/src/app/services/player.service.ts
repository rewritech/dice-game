import { Injectable } from '@angular/core';
import { Player } from '../types';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private players: Player[];

  constructor() {
    this.players = [];
  }

  newPlayer(name: string): Player {
    return {
      id: `${new Date().getTime()}`,
      roomId: -1,
      name,
    };
  }

  setPlayer(newPlayer: Player): void {
    if (this.players.indexOf(newPlayer) === -1) {
      this.players.push(newPlayer);
    }
  }
}
