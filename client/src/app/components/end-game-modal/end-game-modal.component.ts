import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { FormControl } from '@angular/forms'
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
  ctrl = new FormControl()

  heart = faHeart

  constructor(
    private config: NgbModalConfig,
    private modalService: NgbModal,
    public i18n: I18nService
  ) {
    this.config.backdrop = 'static'
    this.config.keyboard = false
  }

  ngOnInit(): void {
    this.ctrl.disable()
    // killedPlayer 내림차순 && life 오름차순 && life가 0이면 꼴찌 소트
    this.room.players.sort((a, b): number => {
      if (b.killedPlayer === a.killedPlayer) {
        if (a.life > b.life) {
          return -1
        }
        return a.life < b.life ? 1 : 0
      }
      return b.killedPlayer - a.killedPlayer
    })
    const defeat = this.room.players.findIndex((p) => p.life === 0)
    if (defeat > -1) {
      this.room.players.push(this.room.players.splice(defeat, 1)[0])
    }
  }

  ngAfterViewInit(): void {
    this.modalService.open(this.content)
  }

  onClick(): void {
    this.modalService.dismissAll()
    this.callBackReplay()
  }
}
