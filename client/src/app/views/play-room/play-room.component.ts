import { Component, HostListener, OnInit, SimpleChange } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Map, Player, Room } from '../../types'
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
  private canMove = false

  room: Room
  player: Player
  cardDisabled = false
  canCardSubmit = false
  startBtnDisableClass = 'disabled'
  positions = ['left-top', 'right-top', 'left-bottom', 'right-bottom']
  pieces: Map[][]
  selectedCard: number[] = []
  callBackOnClick = (x: number, y: number): void => this.move(x, y)
  callBackSelectCard = (num: number): void => this.selectCard(num)
  callBackUnselectCard = (num: number): void => this.unselectCard(num)

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
      // websocket 연결
      this.socket.connect()
      if (this.checkCanJoinRoom(getRoom, this.playerId)) {
        this.playerService.getPlayer(this.playerId).subscribe((player) => {
          this.player = player
          // DB에 player추가
          this.roomService
            .addPlayerToRoom(this.roomId, this.player)
            .subscribe((room) => {
              this.room = room
              this.player._roomId = this.room._id
              this.cardDisabled = !this.checkMyTurn()
              this.changePieces()
              // websocket 연결
              this.socketOnChangeRoom(this.roomId)
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
    // this.leave()
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
      this.socket.emit<Room>('game-start', this.room)
    }
  }

  leave(): void {
    this.socket.emit<Player>('leave', this.player)
    // this.router.navigate(['/rooms'])
  }

  cardSubmit(): void {
    // 카드 제출 player.cards -> room.used
    // 맵에 이동가능 아이콘 표시
    // move 가능한 상태로 변경
    // this.canCardSubmit = !this.canMove && this.checkMyTurn() && this.selectedCard.length > 0
    if (this.canCardSubmit) {
      this.canMove = true
      this.canCardSubmit = false
      this.cardDisabled = true
      console.log('cardSubmit')
    }
  }

  move(x: number, y: number): void {
    // 카드 제출하기 전에는 눌러도 반응이 없어야 한다.
    if (this.canMove) {
      this.canMove = false
      this.cardDisabled = true // 카드 선택불가
      this.player.coordinates = [x, y] // player.coordnates 갱신

      this.room.currentPlayer = this.getNextPlayer() // room.currentPlayer 변경
      this.changePieces()
      // TODO : if (다른 플레이어 좌표 === 이동하려는 좌표) player.life -1
      this.socket.emit('change-turn', { player: this.player, room: this.room })
    }
  }

  selectCard(num: number): void {
    if (this.selectedCard.length < 3) {
      this.selectedCard.push(num)
      this.canCardSubmit = true
      if (this.selectedCard.length > 2) this.cardDisabled = true
    }
  }

  unselectCard(num: number): void {
    const index = this.selectedCard.indexOf(num)
    if (index > -1) this.selectedCard.splice(index, 1)
    if (this.selectedCard.length === 0) this.canCardSubmit = false
    if (this.selectedCard.length < 3) this.cardDisabled = false
  }

  private socketOnChangeRoom(roomId: number): void {
    // websocket room에서 데이터 전송 받기 위한 연결
    this.socket.on<Room>(`changeRoomInfo-${roomId}`, (newRoom: Room) => {
      if (!newRoom) this.router.navigate(['/rooms'])
      this.room = newRoom
      this.cardDisabled = !this.checkMyTurn()
      this.changePieces()
      // 스타트 버튼 활성화 조건
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

  // 다음 플레이어를 가져온다. 배열의 마지막이면 초기로 돌아온다
  private getNextPlayer(): string {
    const { players, currentPlayer } = this.room
    const index = players.findIndex((p) => p._id === currentPlayer) + 1
    const nextIndex = index === players.length ? 0 : index
    return players[nextIndex]._id
  }

  private changePieces(): void {
    this.pieces = this.diceMapService.createPieces(
      this.room,
      !this.checkMyTurn()
    )
  }
}
