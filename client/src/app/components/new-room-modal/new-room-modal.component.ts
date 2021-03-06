import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap'
import { DiceMapService } from '../../services/dice-map.service'
import { RoomService } from '../../services/room.service'
import { CardService } from '../../services/card.service'
import { I18nService } from '../../services/i18n.service'
import { PlayerService } from '../../services/player.service'
import { Room } from '../../types'

@Component({
  selector: 'app-new-room-modal',
  templateUrl: './new-room-modal.component.html',
  styleUrls: ['./new-room-modal.component.scss'],
})
export class NewRoomModalComponent implements OnInit {
  room: Room
  validationError = false
  invalidClass = ''

  private playerId = sessionStorage.getItem('pId')

  constructor(
    private config: NgbModalConfig,
    private modalService: NgbModal,
    private router: Router,
    private roomService: RoomService,
    private diceMapService: DiceMapService,
    private cardService: CardService,
    private playerService: PlayerService,
    public i18n: I18nService
  ) {
    // this.config.backdrop = 'static'
    // this.config.keyboard = false
  }

  ngOnInit(): void {
    //
  }

  open(content: HTMLElement): void {
    const playerId = sessionStorage.getItem('pId')
    if (playerId) {
      this.playerService.getPlayer(playerId).subscribe((player) => {
        if (player) {
          this.validationError = false
          this.invalidClass = ''
          this.diceMapService.createNewMap()
          this.room = {
            title: '',
            players: [],
            playerLimit: 2,
            map: this.diceMapService.getDiceMap(),
            currentPlayer: this.playerId,
            status: 'WAIT',
            cardDeck: {
              unused: [],
              used: [],
            },
            mode: {
              infinity: true,
              item: false,
              scramble: false,
            },
          }
          this.modalService.open(content, {
            ariaLabelledBy: 'modal-basic-title',
          })
        } else {
          sessionStorage.removeItem('pId')
          this.router.navigate(['/login'])
        }
      })
    } else {
      sessionStorage.removeItem('pId')
      this.router.navigate(['/login'])
    }
  }

  onSubmit(): void {
    const title = this.room.title.trim()
    if (title.length > 0 && title.length <= 20) {
      this.modalService.dismissAll()
      this.room.cardDeck.unused = this.cardService.createNewCardDeck(
        this.room.mode
      )
      this.roomService.createRoom(this.room).subscribe((res) => {
        this.router.navigate([`/rooms/${res._id}`])
      })
    } else {
      this.validationError = true
      this.invalidClass = 'border border-danger'
    }
  }
}
