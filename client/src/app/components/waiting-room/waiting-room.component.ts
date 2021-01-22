import { Component, Input, OnInit } from '@angular/core'
import { Room, Player } from '../../types'
import { I18nService } from '../../services/i18n.service'

@Component({
  selector: 'app-waiting-room',
  templateUrl: './waiting-room.component.html',
  styleUrls: ['./waiting-room.component.scss'],
})
export class WaitingRoomComponent implements OnInit {
  @Input() callBackShuffle: () => void
  @Input() callBackStart: () => void
  @Input() room: Room
  @Input() player: Player
  @Input() startBtnDisableClass: string

  i18n: I18nService
  positions = ['left-top', 'right-top', 'left-bottom', 'right-bottom']

  constructor(private i18nService: I18nService) {
    this.i18n = i18nService
  }

  ngOnInit(): void {
    //
  }
}
