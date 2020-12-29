import { Component, HostListener, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Player, Room } from '../../types'
import { SocketConnectService } from '../../services/socket-connect.service'
import { DiceMapService } from '../../services/dice-map.service'
import { RoomService } from '../../services/room.service'
import { PlayerService } from '../../services/player.service'

@Component({
  selector: 'app-play-room',
  templateUrl: './play-room.component.html',
  styleUrls: ['./play-room.component.scss'],
})
export class PlayRoomComponent implements OnInit {
  private roomId = +this.route.snapshot.paramMap.get('id')

  private playerId = localStorage.getItem('pId')

  room: Room

  player: Player

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private diceMapService: DiceMapService,
    private roomService: RoomService,
    private playerService: PlayerService,
    private socket: SocketConnectService
  ) {}

  ngOnInit(): void {
    // websocket 연결
    this.connectSocket(this.roomId)
    this.roomService.getRoom(this.roomId).subscribe((room) => {
      if (!room) {
        this.router.navigate([`/rooms`])
      }
    })

    this.playerService.getPlayer(this.playerId).subscribe((player) => {
      this.player = player
      // DB에 player추가
      this.roomService
        .addPlayerToRoom(this.roomId, this.player)
        .subscribe((room) => {
          this.room = room
          this.player._roomId = this.room._id
          // websocket room에 join
          this.socket.emit<Player>('join-room', this.player)
        })
    })
  }

  @HostListener('window:beforeunload')
  ngOnDestroy(): void {
    this.leave()
  }

  shuffle(): void {
    this.diceMapService.createNewMap()
    this.room.map = this.diceMapService.getDiceMap()
    this.socket.emit<Room>('shuffle-map', this.room)
  }

  leave(): void {
    this.socket.emit<Player>('leave', this.player)
  }

  private connectSocket(roomId: number): void {
    this.socket.connect()
    // websocket room에서 데이터 전송 받기 위한 연결
    this.socket.on<Room>(`changeRoomInfo-${roomId}`, (newRoom: Room) => {
      if (!newRoom) this.router.navigate(['/rooms'])
      this.room = newRoom
    })
  }
}
