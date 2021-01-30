import { Component, Input, OnInit, SimpleChanges } from '@angular/core'
import {
  faChessKnight,
  faChessRook,
  faChessQueen,
  faChessKing,
  IconName,
} from '@fortawesome/free-solid-svg-icons'
import { DiceMapService } from '../../services/dice-map.service'
import { SocketConnectService } from '../../services/socket-connect.service'
import { Player, PieceBtn, Room } from '../../types'

@Component({
  selector: 'app-select-piece-mobile',
  templateUrl: './select-piece-mobile.component.html',
  styleUrls: ['./select-piece-mobile.component.scss'],
})
export class SelectPieceMobileComponent implements OnInit {
  @Input() player: Player
  @Input() room: Room

  private defaultBtnClass = 'btn-outline-light'
  private disableBtnClass = 'disabled cursor-unset'

  positions = {
    leftTop: true,
    rightTop: false,
    leftBottom: false,
    rightBottom: false,
  }
  position: string

  knightPiece: PieceBtn
  rookPiece: PieceBtn
  kingPiece: PieceBtn
  queenPiece: PieceBtn

  constructor(
    private socket: SocketConnectService,
    private diceMapService: DiceMapService
  ) {}

  ngOnInit(): void {
    this.setPieceBtn(this.room)
  }

  selectPosition(position: string): void {
    this.initializePosition()
    this.positions[position] = true
    this.position = position
    this.player.piece = null
    this.socket.emit<Player>('select-piece', this.player)
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initializeBtnClass()
    this.setPieceBtn(changes.room.currentValue)
  }

  selectPiece(pieceBtn: PieceBtn): void {
    if (pieceBtn.isActive) {
      this.player.coordinates = this.getCoordinate(this.position)
      this.player.initialCoordinates = this.getCoordinate(this.position)
      this.player.piece = pieceBtn.piece
      const player = this.room.players.find((p) => p._id === this.player._id)
      this.room.players[this.room.players.indexOf(player)] = this.player
      this.socket.emit<Player>('select-piece', this.player)
    }
  }

  setClassName(pieceBtn: PieceBtn): string {
    const colors = ['btn-primary', 'btn-danger', 'btn-warning', 'btn-success']
    const base = pieceBtn.isActive ? this.defaultBtnClass : this.disableBtnClass
    let result = base
    if (pieceBtn.selectedId) {
      const ids = this.room.players.map((p) => p._id)
      const index = ids.indexOf(pieceBtn.selectedId)
      result = `${pieceBtn.isActive ? '' : this.disableBtnClass} ${
        colors[index]
      }`
    } else {
      result = `${base}${pieceBtn.isActive ? '' : ' btn-outline-secondary'}`
    }
    return result
  }

  private initializePosition(): void {
    this.positions = {
      leftTop: false,
      rightTop: false,
      leftBottom: false,
      rightBottom: false,
    }
  }

  // PieceBtn에 값을 넣는다.
  private setPieceBtn(room: Room) {
    // 본인이 선택한 말 활성화
    this.setActive(this.player, true)

    // 타인
    room.players
      .filter((p) => p._id !== this.player._id)
      .forEach((p) => {
        // 상대방이 선택한 스타팅 포인트 전부 비활성화
        if (
          p.coordinates &&
          this.diceMapService.compare(
            p.coordinates,
            this.getCoordinate(this.position)
          )
        ) {
          this.knightPiece.isActive = false
          this.rookPiece.isActive = false
          this.kingPiece.isActive = false
          this.queenPiece.isActive = false
        }
        // 상대방이 선택한 말 비활성화
        this.setActive(p, false)
      })
  }

  // 버튼의 초기 상태
  private initializeBtnClass() {
    this.knightPiece = {
      isActive: true,
      selectedId: null,
      piece: faChessKnight,
    }
    this.rookPiece = { isActive: true, selectedId: null, piece: faChessRook }
    this.kingPiece = { isActive: true, selectedId: null, piece: faChessKing }
    this.queenPiece = { isActive: true, selectedId: null, piece: faChessQueen }
  }

  // position에 따른 좌표값을 반환한다
  private getCoordinate(position: string): [number, number] {
    switch (position) {
      case 'leftTop':
        return [0, 0]
      case 'rightTop':
        return [0, 9]
      case 'leftBottom':
        return [9, 0]
      case 'rightBottom':
        return [9, 9]
      default:
        return [0, 0]
    }
  }

  // 각 버튼의 isActive를 할당한다.
  // 만약 player의 좌표와 현재 좌표가 같다면 selectedId를 넣는다.
  private setActive(player: Player, isActive: boolean) {
    const condition = this.diceMapService.compare(
      player.coordinates,
      this.getCoordinate(this.position)
    )
    switch (player.piece?.iconName) {
      case 'chess-knight' as IconName:
        this.knightPiece.isActive = isActive
        if (condition) this.knightPiece.selectedId = player._id
        break
      case 'chess-rook' as IconName:
        this.rookPiece.isActive = isActive
        if (condition) this.rookPiece.selectedId = player._id
        break
      case 'chess-king' as IconName:
        this.kingPiece.isActive = isActive
        if (condition) this.kingPiece.selectedId = player._id
        break
      case 'chess-queen' as IconName:
        this.queenPiece.isActive = isActive
        if (condition) this.queenPiece.selectedId = player._id
        break
      default:
        break
    }
  }
}
