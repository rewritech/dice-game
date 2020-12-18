import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Room } from '../../types';
import { DiceMapService } from '../../services/dice-map.service';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit {
  room: Room;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private diceMapService: DiceMapService,
    private roomService: RoomService
  ) {
    // this.roomService.on('new-map-broadcast', (data: number[][]) => {
    //   this.diceMap = data;
    // });
  }

  ngOnInit(): void {
    console.log('oninit');
    // this.shuffle();
    const id = +this.route.snapshot.paramMap.get('id');
    this.roomService.getRoom(id).subscribe((res) => {
      this.room = res;
    });
  }

  ngOnDestroy(): void {
    console.log('destroy');
  }

  // shuffle(): void {
  //   this.diceMapService.createNewMap();
  //   this.diceMap = this.diceMapService.getDiceMap();
  //   this.roomService.emit('new-map', this.diceMap);
  // }

  leave(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.roomService.leaveRoom(id).subscribe((res) => {
      this.router.navigate(['/rooms']);
    });
  }
}
