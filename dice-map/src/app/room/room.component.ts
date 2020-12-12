import { Component, OnInit } from '@angular/core';
import { DiceMapService } from '../dice-map.service';
import * as socketIO from 'socket.io-client';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit {
  diceMap: number[][];
  private socket: socketIO.Socket;

  constructor(private diceMapService: DiceMapService) {
    this.socket = socketIO.io("http://localhost:3000", {transports: ['websocket']})
  }

  ngOnInit(): void {
    this.shupple();
  }

  shupple(): void {
    this.diceMapService.createNewMap();
    console.log(this.diceMapService.getCounter());
    this.diceMap = this.diceMapService.getDiceMap();
  }
}
