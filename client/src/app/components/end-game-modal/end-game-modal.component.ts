import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap'
import { Room } from '../../types'
import { I18nService } from '../../services/i18n.service'

@Component({
  selector: 'app-end-game-modal',
  templateUrl: './end-game-modal.component.html',
  styleUrls: ['./end-game-modal.component.scss'],
})
export class EndGameModalComponent implements OnInit {
  @Input() callBackReplay: () => void
  @Input() room: Room
  @ViewChild('content') content: HTMLElement
  i18n: I18nService

  constructor(
    private config: NgbModalConfig,
    private modalService: NgbModal,
    private i18nService: I18nService
  ) {
    this.config.backdrop = 'static'
    this.config.keyboard = false
    this.i18n = i18nService
  }

  ngOnInit(): void {
    // killedPlayer 내림차순 소트
    this.room.players.sort((a, b): number => {
      return b.killedPlayer - a.killedPlayer
    })
  }

  ngAfterViewInit(): void {
    this.modalService.open(this.content)
  }

  onClick(): void {
    this.modalService.dismissAll()
    this.callBackReplay()
  }
}
