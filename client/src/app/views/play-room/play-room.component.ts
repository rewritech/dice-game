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
  roomStatus = 'WAIT'
  startBtnDisableClass = 'disabled'
  positions = ['left-top', 'right-top', 'left-bottom', 'right-bottom']

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private diceMapService: DiceMapService,
    private roomService: RoomService,
    private playerService: PlayerService,
    private socket: SocketConnectService
  ) {}

  ngOnInit(): void {
    this.roomService.getRoom(this.roomId).subscribe((getRoom) => {
      if (this.checkCanJoinRoom(getRoom, this.playerId)) {
        this.playerService.getPlayer(this.playerId).subscribe((player) => {
          this.player = player
          // DB에 player추가
          this.roomService
            .addPlayerToRoom(this.roomId, this.player)
            .subscribe((room) => {
              this.room = room
              this.roomStatus = this.room.status
              this.player._roomId = this.room._id
              // websocket 연결
              this.connectSocket(this.roomId)
              // websocket room에 join
              this.socket.emit<Player>('join-room', this.player)
            })
        })
      } else {
        // 1. roomid가 데이터에 없는 경우
        // 2. 방에 속하지 않은 플레이어 인데 방에 빈자리가 없는 경우
        this.router.navigate([`/rooms`])
      }
    })
  }

  @HostListener('window:beforeunload')
  ngOnDestroy(): void {
    this.leave()
  }

  // 자식에서 room을 변경한 것을 적용함
  changeRoom($event: Room): void {
    this.room = { ...$event }
    if (this.checkCanStart()) {
      this.startBtnDisableClass = ''
    }
  }

  shuffle(): void {
    this.diceMapService.createNewMap()
    this.room.map = this.diceMapService.getDiceMap()
    this.socket.emit<Room>('shuffle-map', this.room)
  }

  start(): void {
    if (this.checkCanStart()) {
      this.room.status = 'PLAYING'
      this.room.playerLimit = this.room.players.length
      this.roomStatus = this.room.status
      this.socket.emit<Room>('game-start', this.room)
    }
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
      this.roomStatus = this.room.status
      if (this.room.status === 'WAIT' && this.checkCanStart()) {
        this.startBtnDisableClass = ''
      }
    })
  }

  // 1. room이 존재함
  // 2. 이미 방에 속한 플레이어 인 경우
  // 3. 방에 빈자리가 있는 경우
  private checkCanJoinRoom(room: Room, playerId: string): boolean {
    return (
      room &&
      (room.players.filter((p) => p._id === playerId).length === 1 ||
        room.players.length < room.playerLimit)
    )
  }

  private checkMyTurn(): boolean {
    return this.player._id === this.room.currentPlayer
  }

  private checkReadyToStart(): boolean {
    return this.room.players.filter((p) => p.coordinates).length > 1
  }

  private checkCanStart(): boolean {
    return this.checkMyTurn() && this.checkReadyToStart()
  }
}
