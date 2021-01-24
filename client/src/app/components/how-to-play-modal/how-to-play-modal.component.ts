import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { I18nService } from '../../services/i18n.service'
import { PlayerService } from '../../services/player.service'

@Component({
  selector: 'app-how-to-play-modal',
  templateUrl: './how-to-play-modal.component.html',
  styleUrls: ['./how-to-play-modal.component.scss'],
})
export class HowToPlayModalComponent implements OnInit {
  dotIcon = faCheck

  constructor(
    private config: NgbModalConfig,
    private modalService: NgbModal,
    public i18n: I18nService,
    private router: Router,
    private playerService: PlayerService
  ) {
    // this.config.backdrop = 'static'
    // this.config.keyboard = false
  }

  ngOnInit(): void {
    // onInit
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
}
