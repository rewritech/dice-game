import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Player, Room } from '../../types';
import { SocketConnectService } from '../../services/socket-connect.service';
import { DiceMapService } from '../../services/dice-map.service';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'app-play-room',
  templateUrl: './play-room.component.html',
  styleUrls: ['./play-room.component.scss'],
})
export class PlayRoomComponent implements OnInit {
  room: Room;

  player: Player;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private diceMapService: DiceMapService,
    private roomService: RoomService,
    private socket: SocketConnectService
  ) {}

  ngOnInit(): void {
    const roomId = +this.route.snapshot.paramMap.get('id');
    const playerId = this.route.snapshot.queryParamMap.get('pid');
    this.roomService.getRoom(roomId).subscribe((res) => {
      if (!res) {
        this.router.navigate(['/rooms']);
      } else {
        this.room = res;
        this.player = this.room.players.find(
          (p) => Number(p.id) === Number(playerId)
        );
        // websocket 연결
        this.socket.connect();
        // websocket room에서 데이터 전송 받기 위한 연결
        this.socket.on<Room>(`changeRoomInfo-${roomId}`, (newRoom: Room) => {
          this.room = newRoom;
        });
        // websocket room에 join
        this.socket.emit<Player>('join-room', this.player);
      }
    });
  }

  @HostListener('window:beforeunload')
  ngOnDestroy(): void {
    this.leave();
  }

  shuffle(): void {
    this.diceMapService.createNewMap();
    this.room.map = this.diceMapService.getDiceMap();
    this.socket.emit<Room>('shuffle-map', this.room);
  }

  leave(): void {
    this.socket.emit<Player>('leave', this.player);
    // this.router.navigate(['/rooms']);
  }
}
