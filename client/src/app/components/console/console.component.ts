import { Component, Input, OnInit } from '@angular/core'
import { trigger, style, animate, transition } from '@angular/animations'
import { Player, Room, SelectedCard } from '../../types'
import { I18nService } from '../../services/i18n.service'

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss'],
  animations: [
    trigger('cardLeaveAnimate', [
      transition(':leave', [
        animate('0.3s'),
        style({ transform: `translateY(-100%)` }),
      ]),
    ]),
  ],
})
export class ConsoleComponent implements OnInit {
  @Input() room: Room
  @Input() player: Player
  @Input() selectedCards: SelectedCard[]
  @Input() cardDisabled: boolean
  @Input() callBackUnselectCard: (sc: SelectedCard) => void
  @Input() callBackSelectCard: (sc: SelectedCard) => void

  constructor(public i18n: I18nService) {}

  ngOnInit(): void {
    //
  }

  // 선택된 카드인지 확인한다.
  isSelectedCard(num: number, index: number): boolean {
    return !!this.selectedCards.find((c) => c.num === num && c.index === index)
  }
}
