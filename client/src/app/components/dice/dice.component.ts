import { Component, OnInit, Input } from '@angular/core'
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-dice',
  templateUrl: './dice.component.html',
  styleUrls: ['./dice.component.scss'],
})
export class DiceComponent implements OnInit {
  @Input() num: number
  @Input() icon: IconDefinition
  @Input() disabled: boolean
  @Input() coordinate: [number, number]
  @Input() callBackOnClick: (x: number, y: number) => void

  colors = [
    'btn-success',
    'btn-warning',
    'btn-secondary',
    'btn-danger',
    'btn-info',
    'btn-primary',
  ]
  disabledClass: string

  constructor() {}

  ngOnInit(): void {
    this.disabledClass = this.disabled ? 'disabled cursor-unset' : ''
  }

  onClick(): void {
    this.callBackOnClick(this.coordinate[0], this.coordinate[1])
  }
}
