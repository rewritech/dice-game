import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Room } from '../../types';
import { DiceMapService } from '../../services/dice-map.service';
import { RoomService } from '../../services/room.service';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-new-room',
  templateUrl: './new-room.component.html',
  styleUrls: ['./new-room.component.scss'],
})
export class NewRoomComponent implements OnInit {
  room: Room;

  constructor(
    private router: Router,
    private roomService: RoomService,
    private diceMapService: DiceMapService,
    private playerService: PlayerService
  ) {}

  ngOnInit(): void {
    this.diceMapService.createNewMap();
    this.room = {
      title: '',
      players: [],
      playerLimit: 2,
      map: this.diceMapService.getDiceMap(),
    };
  }

  onSubmit(form: Room): void {
    const player = this.playerService.newPlayer('asdf');
    this.room.title = form.title;
    this.room.players.push(player); // TODO
    this.room.playerLimit = form.playerLimit;
    this.roomService.newRoom(this.room).subscribe((res) => {
      this.playerService.setPlayer(res.players[0]);
      sessionStorage.setItem('pid', player.id);
      this.router.navigate([`/rooms/${res.id}`], {
        queryParams: { pid: player.id },
      });
    });
  }
}
