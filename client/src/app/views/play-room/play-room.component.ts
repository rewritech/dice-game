import { Component, HostListener, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Map, Player, Room, SelectedCard } from '../../types'
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
  private CARD_SELECT_LIMIT = 3
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
  selectedCards: SelectedCard[] = []
  callBackOnClick = (x: number, y: number): void => this.move(x, y)
  callBackSelectCard = (sc: SelectedCard): void => this.selectCard(sc)
  callBackUnselectCard = (sc: SelectedCard): void => this.unselectCard(sc)

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
      if (this.roomService.checkCanJoinRoom(getRoom, this.playerId)) {
        this.playerService.getPlayer(this.playerId).subscribe((player) => {
          this.player = player
          // DB에 player추가
          this.roomService
            .addPlayerToRoom(this.roomId, this.player)
            .subscribe((room) => {
              this.room = room
              this.player._roomId = this.room._id
              this.cardDisabled = !this.roomService.checkMyTurn(
                this.player,
                this.room
              )
              this.pieces = this.diceMapService.createPieces(
                this.room,
                !this.roomService.checkMyTurn(this.player, this.room)
              )
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
    this.leave()
  }

  // 자식에서 room을 변경한 것을 적용함
  changeRoom($event: Room): void {
    this.room = { ...$event }
    if (this.roomService.checkCanStart(this.player, this.room)) {
      this.startBtnDisableClass = ''
    }
  }

  shuffle(): void {
    this.diceMapService.createNewMap()
    this.room.map = this.diceMapService.getDiceMap()
    this.socket.emit<Room>('shuffle-map', this.room)
  }

  start(): void {
    if (this.roomService.checkCanStart(this.player, this.room)) {
      this.room.status = 'PLAYING'
      this.room.playerLimit = this.room.players.length
      this.socket.emit<Room>('game-start', this.room)
    }
  }

  leave(): void {
    this.socket.emit<Player>('leave', this.player)
    // this.router.navigate(['/rooms'])
  }

  selectCard(selectedCard: SelectedCard): void {
    // 현재 카드 한계선보다 적게 선택했다면
    if (this.selectedCards.length < this.CARD_SELECT_LIMIT) {
      this.selectedCards.push(selectedCard) // 카드 추가
      this.canCardSubmit = true // 카드 제출 활성화

      // 추가 후에 한계를 넘는다면 카드 비활성화
      if (this.selectedCards.length >= this.CARD_SELECT_LIMIT) {
        this.cardDisabled = true
      }
    }
  }

  unselectCard(sc: SelectedCard): void {
    const index = this.selectedCards.findIndex((c) => c.index === sc.index)
    // 카드제거
    if (index > -1) this.selectedCards.splice(index, 1)
    // 카드제출 버튼 비활성화
    if (this.selectedCards.length === 0) this.canCardSubmit = false
    // 카드 선택 한계 보다 작아지면 다시 선택가능 상태로
    if (this.selectedCards.length < this.CARD_SELECT_LIMIT) {
      this.cardDisabled = false
    }
  }

  cardSubmit(): void {
    if (this.canCardSubmit) {
      // move 가능한 상태로 변경
      this.canMove = true
      // 카드 제출 비활성화
      this.canCardSubmit = false
      // 카드 비활성화
      this.cardDisabled = true
      // 카드 제출 player.cards -> room.used
      const targetCards = this.selectedCards.map((c) => c.num)
      const targetIndexes = this.selectedCards.map((c) => c.index)
      this.player.cards = this.player.cards.filter(
        (_, i) => !targetIndexes.includes(i)
      )
      this.room.cardDeck.used = this.room.cardDeck.used.concat(targetCards)
      this.selectedCards = []

      // TODO: 맵에 이동가능 아이콘 표시
      // TODO: emit
    }
  }

  move(x: number, y: number): void {
    // 카드 제출하기 전에는 눌러도 반응이 없어야 한다.
    if (this.canMove) {
      this.canMove = false
      this.cardDisabled = true // 카드 비활성화
      this.player.coordinates = [x, y] // player.coordnates 갱신

      this.room.currentPlayer = this.roomService.getNextPlayer(this.room) // room.currentPlayer 변경

      // 적플레이어를 잡으면 라이프 -1, 말 위치 초기화
      const targetIndex = this.room.players.findIndex(
        (p) =>
          this.diceMapService.compare(p.coordinates, [x, y]) &&
          p._id !== this.player._id
      )
      if (targetIndex > -1) {
        this.room.players[targetIndex].life -= 1
        this.room.players[targetIndex].coordinates = this.room.players[
          targetIndex
        ].initialCoordinates
        this.player.killedPlayer += 1
        this.socket.emit('catch-player', this.room.players[targetIndex])
      }

      this.pieces = this.diceMapService.createPieces(
        this.room,
        !this.roomService.checkMyTurn(this.player, this.room)
      )
      this.socket.emit('change-turn', { player: this.player, room: this.room })
    }
  }

  // 선택된 카드인지 확인한다.
  isSelectedCard(num: number, index: number): boolean {
    return !!this.selectedCards.find((c) => c.num === num && c.index === index)
  }

  private socketOnChangeRoom(roomId: number): void {
    // websocket room에서 데이터 전송 받기 위한 연결
    this.socket.on<Room>(`changeRoomInfo-${roomId}`, (newRoom: Room) => {
      if (!newRoom) this.router.navigate(['/rooms'])
      this.room = newRoom
      this.player = newRoom.players.find((p) => p._id === this.playerId)
      this.cardDisabled = !this.roomService.checkMyTurn(this.player, this.room) // 내턴이면 카드 활성화
      this.pieces = this.diceMapService.createPieces(
        this.room,
        !this.roomService.checkMyTurn(this.player, this.room)
      )
      // 스타트 버튼 활성화 조건
      if (
        this.room.status === 'WAIT' &&
        this.roomService.checkCanStart(this.player, this.room)
      ) {
        this.startBtnDisableClass = ''
      }
    })
  }
}
