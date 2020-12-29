import { Component, OnInit, Input } from '@angular/core'
import { Router } from '@angular/router'
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap'
import { PlayerService } from '../../services/player.service'
import { Player, Room } from '../../types'

@Component({
  selector: 'app-player-edit-modal',
  templateUrl: './player-edit-modal.component.html',
  styleUrls: ['./player-edit-modal.component.scss'],
})
export class PlayerEditModalComponent implements OnInit {
  player: Player

  private playerId = localStorage.getItem('pId')

  constructor(
    private config: NgbModalConfig,
    private modalService: NgbModal,
    private router: Router,
    private playerService: PlayerService
  ) {
    // this.config.backdrop = 'static'
    // this.config.keyboard = false
  }

  ngOnInit(): void {
    this.playerService.getPlayer(this.playerId).subscribe((player) => {
      this.player = player
    })
  }

  open(content: any): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
  }

  onSubmit(form: Player): void {
    this.playerService.editPlayer(form).subscribe(() => {
      window.location.reload()
    })
  }
}
