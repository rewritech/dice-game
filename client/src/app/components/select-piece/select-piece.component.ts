import { Component, Input, OnInit, SimpleChanges } from '@angular/core'
import {
  IconDefinition,
  faChessKnight,
  faChessRook,
  faChessQueen,
  faChessKing,
  IconName,
} from '@fortawesome/free-solid-svg-icons'
import { SocketConnectService } from '../../services/socket-connect.service'
import { Player, Room } from '../../types'

@Component({
  selector: 'app-select-piece',
  templateUrl: './select-piece.component.html',
  styleUrls: ['./select-piece.component.scss'],
})
export class SelectPieceComponent implements OnInit {
  @Input() position: string
  @Input() player: Player
  @Input() room: Room

  knight = faChessKnight
  rook = faChessRook
  king = faChessKing
  queen = faChessQueen

  defaultBtnClass = 'btn-outline-light'
  disableBtnClass = 'disabled cursor-unset btn-dark'
  otherPlayerBtnClass = 'disabled cursor-unset btn-primary'

  knightActive = true
  rookActive = true
  kingActive = true
  queenActive = true

  constructor(private socket: SocketConnectService) {}

  ngOnInit(): void {
    // this.setBtnClass(this.room, false)
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setBtnClass(changes.room.previousValue || this.room, true)
    this.setBtnClass(changes.room.currentValue, false)
  }

  selectPiece(
    position: string,
    piece: IconDefinition,
    isActive: boolean
  ): void {
    if (isActive) {
      this.player.coordinates = this.getCoordinate(position)
      this.player.piece = piece
      this.socket.emit('select-piece', this.player)
    }
  }

  // disable 처리
  private setBtnClass(room: Room, isActive: boolean) {
    const otherPlayers = room.players.filter((p) => p._id !== this.player._id)
    otherPlayers.forEach((p) => {
      switch (p.piece.iconName) {
        case 'chess-knight' as IconName:
          this.knightActive = isActive
          break
        case 'chess-rook' as IconName:
          this.rookActive = isActive
          break
        case 'chess-king' as IconName:
          this.kingActive = isActive
          break
        case 'chess-queen' as IconName:
          this.queenActive = isActive
          break
        default:
          break
      }

      // 상대방이 선택한 스타팅 포인트 전부 비활성화
      if (
        JSON.stringify(p.coordinates) ===
        JSON.stringify(this.getCoordinate(this.position))
      ) {
        this.knightActive = isActive
        this.rookActive = isActive
        this.kingActive = isActive
        this.queenActive = isActive
      }
    })
  }

  private getCoordinate(position: string): [number, number] {
    switch (position) {
      case 'left-top':
        return [0, 0]
      case 'right-top':
        return [9, 0]
      case 'left-bottom':
        return [0, 9]
      case 'right-bottom':
        return [9, 9]
      default:
        return [0, 0]
    }
  }
}
