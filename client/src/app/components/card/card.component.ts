import { Component, Input, OnInit } from '@angular/core'
import { trigger, style, animate, transition } from '@angular/animations'
import { SelectedCard } from '../../types'

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  animations: [
    trigger('cardAnimate', [
      transition(':enter', [
        style({ transform: `translateX(-1000%)` }),
        animate('1s'),
      ]),
    ]),
  ],
})
export class CardComponent implements OnInit {
  @Input() callBackSelectCard: (selectedCard: SelectedCard) => void
  @Input() callBackUnselectCard: (selectedCard: SelectedCard) => void
  @Input() num: number
  @Input() index: number
  @Input() disabled: boolean
  @Input() selected: boolean

  disabledClass: string
  isItem: boolean
  bgColors = ['bg-danger', 'bg-warning', 'bg-primary']

  // constructor() {}

  ngOnInit(): void {
    // onInit
    this.isItem = this.num > 6
  }

  ngOnChanges(): void {
    this.disabledClass =
      this.disabled && !this.selected ? 'disabled cursor-unset' : ''
  }

  onClick(num: number): void {
    // 1. disabled 이면 클릭 해도 반응이 없을 것
    // 2. selected 이면 unselected가 실행될 것
    // 3. disabled 이지만 selected 라면 선택가능할 것
    const selectedCard = { num, index: this.index }
    if (!this.disabled || this.selected) {
      if (this.selected) {
        this.callBackUnselectCard(selectedCard)
      } else {
        this.callBackSelectCard(selectedCard)
      }
      this.selected = !this.selected
    }
  }
}
