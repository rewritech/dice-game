import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() callBackSelectCard: (num: number) => void
  @Input() callBackUnselectCard: (num: number) => void
  @Input() num: number
  @Input() disabled: boolean

  selected: boolean
  disabledClass: string

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.disabledClass =
      this.disabled && !this.selected ? 'disabled cursor-unset' : ''
  }

  onClick(num: number): void {
    // 1. disabled 이면 클릭 해도 반응이 없을 것
    // 2. selected 이면 unselected가 실행될 것
    // 3. disabled 이지만 selected 라면 선택가능할 것

    if (!this.disabled || this.selected) {
      this.selected
        ? this.callBackUnselectCard(num)
        : this.callBackSelectCard(num)
      this.selected = !this.selected
    }
  }
}
