import { Component, OnInit } from '@angular/core';
import { DiceMapService } from '../dice-map.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit {
  diceMap: number[][];

  constructor(private diceMapService: DiceMapService) { }

  ngOnInit(): void {
    this.diceMapService.createNewMap();
    console.log(this.diceMapService.getCounter());
    this.diceMap = this.diceMapService.getDiceMap();
  }
}
