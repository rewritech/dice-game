import { Component, OnInit } from '@angular/core';
import { DiceMapService } from '../dice-map.service';
import { RoomService } from '../room.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit {
  diceMap: number[][];

  constructor(
    private diceMapService: DiceMapService,
    private roomService: RoomService
  ) {
    this.roomService.on("new-map-broadcast", (data: number[][]) => {
      this.diceMap = data;
    })
  }

  ngOnInit(): void {
    this.shupple();
  }

  shupple(): void {
    this.diceMapService.createNewMap();
    this.diceMap = this.diceMapService.getDiceMap();
    this.roomService.emit("new-map", this.diceMap);
  }
}
