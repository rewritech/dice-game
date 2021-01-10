import { Component, Input, OnInit } from '@angular/core'
import { Player, Room, SelectedCard } from '../../types'
import { I18nService } from '../../services/i18n.service'

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss']
})
export class ConsoleComponent implements OnInit {
  @Input() room: Room
  @Input() player: Player
  @Input() selectedCards: SelectedCard[]
  @Input() canCardSubmit: boolean
  @Input() cardDisabled: boolean
  @Input() callBackUnselectCard: (sc: SelectedCard) => void
  @Input() callBackSelectCard: (sc: SelectedCard) => void
  @Input() callBackCardSubmit: () => void

  i18n: I18nService

  constructor(private i18nService: I18nService) {
    this.i18n = i18nService
  }

  ngOnInit(): void {
    //
  }

  // 선택된 카드인지 확인한다.
  isSelectedCard(num: number, index: number): boolean {
    return !!this.selectedCards.find((c) => c.num === num && c.index === index)
  }
}
