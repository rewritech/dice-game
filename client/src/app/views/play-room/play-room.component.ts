import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { AnimationOption, Map, Player, Room, SelectedCard } from '../../types'
import { SocketConnectService } from '../../services/socket-connect.service'
import { DiceMapService } from '../../services/dice-map.service'
import { RoomService } from '../../services/room.service'
import { PlayerService } from '../../services/player.service'
import { I18nService } from '../../services/i18n.service'
import { CardService } from '../../services/card.service'

const ONE_MINITE = 10000

@Component({
  selector: 'app-play-room',
  templateUrl: './play-room.component.html',
  styleUrls: ['./play-room.component.scss'],
})
export class PlayRoomComponent implements OnInit {
  private CARD_SELECT_LIMIT = 3
  private roomId = +this.route.snapshot.paramMap.get('id')
  private playerId = sessionStorage.getItem('pId')
  private NEW_DECK: number
  private ADD_DECK: number
  private GAME_OVER_CONDITION_KILLED = 5
  private GAME_OVER_CONDITION_LIFE = 0

  room: Room
  player: Player
  currentPlayerName: string
  aniConfig: AnimationOption
  cardDisabled = false
  startBtnDisableClass = 'disabled'
  pieces: Map[][]
  selectedCards: SelectedCard[] = []
  callBackOnClick = (x: number, y: number): void => this.move(x, y)
  callBackSelectCard = (sc: SelectedCard): void => this.selectCard(sc)
  callBackUnselectCard = (sc: SelectedCard): void => this.unselectCard(sc)
  callBackShuffle = (): void => this.shuffle()
  callBackStart = (): void => this.start()
  callBackCardSubmit = (): void => this.cardSubmit()
  callBackReplay = (): void => this.replay()
  time = ONE_MINITE
  timerId: NodeJS.Timeout
  timeOutId: NodeJS.Timeout
  endGame = false

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private diceMapService: DiceMapService,
    private roomService: RoomService,
    private playerService: PlayerService,
    private socket: SocketConnectService,
    public i18n: I18nService,
    private modalService: NgbModal,
    private cardService: CardService
  ) {
    this.NEW_DECK = this.roomService.newDeckNum()
    this.ADD_DECK = this.roomService.addDeckNum()
  }

  ngOnInit(): void {
    this.player = this.playerService.get()
    this.roomService.getRoom(this.roomId).subscribe((getRoom) => {
      this.socket.connect()
      if (this.player && this.roomService.canJoinRoom(getRoom, this.playerId)) {
        this.roomService
          .addPlayerToRoom(this.roomId, this.player)
          .subscribe((room) => {
            this.room = room
            this.player._roomId = this.room._id
            this.buildCard()
            this.socketOnChangeRoom(this.roomId)
            this.socketOnStartGame(this.roomId)
            this.socketOnChangeTurn(this.roomId)
            this.socket.emit<Player>('join-room', this.player)
          })
      } else {
        this.router.navigate([`/rooms`])
      }
    })
  }

  ngOnDestroy(): void {
    this.leave()
  }

  shuffle(): void {
    this.diceMapService.createNewMap()
    this.room.map = this.diceMapService.getDiceMap()
    this.socket.emit<Room>('shuffle-map', this.room)
  }

  start(): void {
    if (this.roomService.checkCanStart(this.player, this.room)) {
      this.currentPlayerName = this.player.name
      this.room.status = 'PLAYING'
      this.room.playerLimit = this.room.players.length
      this.aniConfig = { value: 'insert', params: { x: 0, y: 0 } }

      // 초기 카드 분배
      for (let i = 0; i < this.room.players.length; i += 1) {
        const spNum =
          this.player._id === this.room.players[i]._id
            ? this.NEW_DECK + this.ADD_DECK
            : this.NEW_DECK
        this.room.players[i].cards = this.room.cardDeck.unused.splice(0, spNum)
      }

      this.socket.emit('game-start', this.room)
      this.startTimer()
    }
  }

  leave(): void {
    if (this.player) {
      this.modalService.dismissAll()
      this.initializeTimer()
      this.socket.emit('leave', this.player)
    }
  }

  replay(): void {
    this.cardService.createNewCardDeck()
    this.room.status = 'WAIT'
    this.room.cardDeck = {
      unused: this.cardService.getCardDeck(),
      used: [],
    }
    this.socket.emit('replay', this.room)
  }

  selectCard(selectedCard: SelectedCard): void {
    // 현재 카드 한계선보다 적게 선택했다면
    if (this.selectedCards.length < this.CARD_SELECT_LIMIT) {
      this.selectedCards.push(selectedCard) // 카드 추가

      // 추가 후에 한계를 넘는다면 카드 비활성화
      if (this.selectedCards.length >= this.CARD_SELECT_LIMIT) {
        this.cardDisabled = true
      }
      this.accessibleArea()
    }
  }

  unselectCard(sc: SelectedCard): void {
    const index = this.selectedCards.findIndex((c) => c.index === sc.index)
    // 카드제거
    if (index > -1) this.selectedCards.splice(index, 1)
    // 카드 선택 한계 보다 작아지면 다시 선택가능 상태로
    if (this.selectedCards.length < this.CARD_SELECT_LIMIT) {
      this.cardDisabled = false
    }
    this.accessibleArea()
  }

  move(x: number, y: number): void {
    // 카드 제출하기 전에는 눌러도 반응이 없어야 한다.
    if (!this.pieces[x][y].disabled) {
      const { coordinates } = this.player
      this.cardSubmit()
      this.initializeTimer()
      this.moveAnimate([x, y], coordinates)
      this.player.coordinates = [x, y] // player.coordnates 갱신
      this.catch(x, y) // 적플레이어를 잡으면 라이프 -1, 말 위치 초기화

      if (this.endGame) {
        this.endGame = false
        this.room.status = 'END'
        this.socket.emit('end-game', {
          player: this.player,
          room: this.room,
        })
      } else {
        this.buildCard() // 말이동 적용
        this.socket.emit('change-turn', {
          aniConfig: this.aniConfig,
          player: this.player,
          room: this.room,
        })
      }
    }
  }

  // 선택된 카드인지 확인한다.
  isSelectedCard(num: number, index: number): boolean {
    return !!this.selectedCards.find((c) => c.num === num && c.index === index)
  }

  private cardSubmit(): void {
    this.cardDisabled = true // 카드 비활성화

    // 카드 제출 player.cards -> room.used
    const targetCards = this.selectedCards.map((c) => c.num)
    const targetIndexes = this.selectedCards.map((c) => c.index)
    this.player.cards = this.player.cards.filter(
      (_, i) => !targetIndexes.includes(i)
    )
    this.room.cardDeck.used = this.room.cardDeck.used.concat(targetCards)
    this.selectedCards = []
  }

  // websocket room에서 데이터 전송 받기 위한 연결
  // join-room, shuffle-map, select-piece, leave
  // 자신을 포함한 모든 유저
  private socketOnChangeRoom(roomId: number): void {
    this.socket.on<Room>(`changeRoomInfo-${roomId}`, (newRoom: Room) => {
      this.initializeTimer()
      this.aniConfig = null
      this.room = newRoom
      this.player =
        newRoom && newRoom.players.find((p) => p._id === this.playerId)

      if (this.room && this.player) {
        this.buildCard() // 내턴이면 카드 활성화
        this.enableStartBtn() // 스타트 버튼 활성화
      } else {
        this.router.navigate(['/rooms'])
      }
    })
  }

  // 게임 시작 시 단한번 실행
  // game-start
  // 자신을 제외한 모든 유저
  private socketOnStartGame(roomId: number): void {
    this.socket.on<Room>(`start-game-${roomId}`, (newRoom: Room) => {
      this.room = newRoom
      this.player = newRoom.players.find((p) => p._id === this.playerId)
      this.aniConfig = { value: 'insert', params: { x: 0, y: 0 } }
      this.setCurrentPlayerName()
      this.buildCard()
      this.startTimer()
    })
  }

  // 턴 변경시
  // change-turn
  // 자신을 제외한 모든 유저
  private socketOnChangeTurn(roomId: number): void {
    this.socket.on(
      `change-turn-${roomId}`,
      (value: { room: Room; aniConfig: AnimationOption }) => {
        const { room, aniConfig } = value
        this.room = room
        this.player = room.players.find((p) => p._id === this.playerId)
        this.aniConfig = aniConfig
        this.setCurrentPlayerName()
        this.buildCard() // 내턴이면 카드 활성화
        this.startTimer() // 타이머 시작
      }
    )
  }

  private setCurrentPlayerName(): void {
    const currentPlayer = this.room.players.find(
      (p) => p._id === this.room.currentPlayer
    )
    this.currentPlayerName = currentPlayer.name
  }

  private startTimer() {
    this.initializeTimer()
    this.timerId = setInterval(() => {
      if (this.time > 0) this.time -= 10
    }, 10)

    this.timeOutId = setTimeout(() => {
      this.timeOutChangeTurn() // 강제 카드 1장 제출 및 턴종료
    }, ONE_MINITE + 200)
  }

  private timeOutChangeTurn(): void {
    this.initializeTimer()
    if (this.roomService.checkMyTurn(this.player, this.room)) {
      this.aniConfig = null
      this.selectedCards = []

      // 1 장 랜덤 삭제
      const randomIndex = Math.floor(
        Math.random() * (this.player.cards.length - 1)
      )
      this.room.cardDeck.used = this.room.cardDeck.used.concat(
        this.player.cards.splice(randomIndex, 1)
      )
      this.buildCard()

      this.socket.emit('change-turn', {
        aniConfig: this.aniConfig,
        player: this.player,
        room: this.room,
      })
    }
  }

  // 타이머 초기화
  private initializeTimer() {
    clearInterval(this.timerId)
    clearTimeout(this.timeOutId)
    this.time = ONE_MINITE
  }

  // 내턴이면 주사위 활성화
  private buildCard(): void {
    this.cardDisabled = !this.roomService.checkMyTurn(this.player, this.room)
    this.pieces = this.diceMapService.createPieces(this.room, true)
  }

  private accessibleArea() {
    const selectedNums = this.selectedCards.map((card) => card.num)
    this.aniConfig = null
    this.pieces = this.diceMapService.getAccessibleArea(
      this.room,
      selectedNums,
      this.player
    )
  }

  // 말 이동 애니메이션
  private moveAnimate(
    coordinates: [number, number],
    moveTo: [number, number]
  ): void {
    const moveCoord: [number, number] = [
      moveTo[1] - coordinates[1],
      moveTo[0] - coordinates[0],
    ]
    this.aniConfig = {
      value: 'move',
      params: { x: 100 * moveCoord[0], y: 100 * moveCoord[1] },
      target: [coordinates[0], coordinates[1]],
    }
  }

  // 이동 좌표에 다른 유저가 있으면 catch-player
  private catch(x: number, y: number): void {
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
      // 게임종료 판단
      this.endGame =
        this.player.killedPlayer === this.GAME_OVER_CONDITION_KILLED ||
        this.room.players[targetIndex].life === this.GAME_OVER_CONDITION_LIFE
      this.socket.emit('catch-player', this.room.players[targetIndex])
    }
  }

  // 시작버튼 확성화
  // 대기상태 && 시작가능 상태(2인 이상 선택)
  private enableStartBtn(): void {
    if (
      this.room.status === 'WAIT' &&
      this.roomService.checkCanStart(this.player, this.room)
    ) {
      this.startBtnDisableClass = ''
    } else {
      this.startBtnDisableClass = 'disabled'
    }
  }
}
