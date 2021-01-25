import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
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
  validationError = false
  invalidClass = ''

  private playerId = sessionStorage.getItem('pId')

  constructor(
    private config: NgbModalConfig,
    private modalService: NgbModal,
    private playerService: PlayerService,
    private router: Router,
    public i18n: I18nService
  ) {
    // this.config.backdrop = 'static'
    // this.config.keyboard = false
  }

  ngOnInit(): void {
    this.playerService.getPlayer(this.playerId).subscribe((player) => {
      this.player = player
    })
  }

  open(content: HTMLElement): void {
    const playerId = sessionStorage.getItem('pId')
    if (playerId) {
      this.playerService.getPlayer(playerId).subscribe((player) => {
        if (player) {
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

  onSubmit(value: Player): void {
    const name = value.name.trim()
    if (name.length > 0 && name.length <= 10) {
      this.player.name = name
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
