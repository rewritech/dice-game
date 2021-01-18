import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap'
import { Room, Player } from '../../types'
import { I18nService } from '../../services/i18n.service'

@Component({
  selector: 'app-end-game-modal',
  templateUrl: './end-game-modal.component.html',
  styleUrls: ['./end-game-modal.component.scss']
})
export class EndGameModalComponent implements OnInit {
  @Input() room: Room
  @Input() player: Player
  @ViewChild('content') content: HTMLElement

  constructor(
    private config: NgbModalConfig,
    private modalService: NgbModal,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
   }

  ngOnInit(): void {
    this.room.players.sort((a, b): number => {
      return b.killedPlayer - a.killedPlayer;
    });
  }

  ngAfterViewInit(): void {
    this.modalService.open(this.content)
  }

  onClick(): void  {
    console.log('click');
  }
}
