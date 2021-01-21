import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap'
import { Room, Player } from '../../types'
import { I18nService } from '../../services/i18n.service'
import { PlayerService } from '../../services/player.service'

@Component({
  selector: 'app-end-game-modal',
  templateUrl: './end-game-modal.component.html',
  styleUrls: ['./end-game-modal.component.scss']
})
export class EndGameModalComponent implements OnInit {
  @Input() callBackReplay: () => void
  @Input() room: Room
  @ViewChild('content') content: HTMLElement
  i18n: I18nService
  
  modal;
  constructor(
    private config: NgbModalConfig,
    private modalService: NgbModal,
    private playerService: PlayerService,
    private i18nService: I18nService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    this.i18n = i18nService

   }

  ngOnInit(): void {
    // killedPlayer 내림차순 소트
    this.room.players.sort((a, b): number => {
      return b.killedPlayer - a.killedPlayer;
    });
  }

  ngAfterViewInit(): void {
    this.modal = this.modalService.open(this.content);
  }

  onClick(): void  {
    this.modal.close();
    if(this.room.status!=='WAIT'){
      this.room.players.forEach((p) => {
        // 플레이어 초기화
        p.cards = [],
        p.coordinates = null,
        p.initialCoordinates = null,
        p.killedPlayer = 0,
        p.life = 3
        this.playerService.editPlayer(p)
      })
    }
    this.callBackReplay();

  }
}
