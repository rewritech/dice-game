import { Component, OnInit } from '@angular/core'
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap'
import { PlayerService } from '../../services/player.service'
import { I18nService } from '../../services/i18n.service'
import { Player } from '../../types'

@Component({
  selector: 'app-player-edit-modal',
  templateUrl: './player-edit-modal.component.html',
  styleUrls: ['./player-edit-modal.component.scss'],
})
export class PlayerEditModalComponent implements OnInit {
  player: Player
  i18n: I18nService
  validationError = false
  invalidClass = ''

  private playerId = sessionStorage.getItem('pId')

  constructor(
    private config: NgbModalConfig,
    private modalService: NgbModal,
    private playerService: PlayerService,
    private i18nService: I18nService
  ) {
    this.i18n = i18nService
    // this.config.backdrop = 'static'
    // this.config.keyboard = false
  }

  ngOnInit(): void {
    this.playerService.getPlayer(this.playerId).subscribe((player) => {
      this.player = player
    })
  }

  open(content: HTMLElement): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
  }

  onSubmit(value: Player): void {
    if (value.name.trim().length > 0) {
      this.player.name = value.name
      this.playerService.editPlayer(this.player).subscribe(() => {
        this.modalService.dismissAll()
        this.invalidClass = ''
        this.validationError = false
      })
    } else {
      this.validationError = true
      this.invalidClass = 'border border-danger'
    }
  }
}
