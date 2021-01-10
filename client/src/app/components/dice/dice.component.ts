import { Component, OnInit, Input } from '@angular/core'
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { trigger, style, animate, transition } from '@angular/animations'

@Component({
  selector: 'app-dice',
  templateUrl: './dice.component.html',
  styleUrls: ['./dice.component.scss'],
  animations: [
    trigger('insert', [
      transition(':enter', [
        style({ transform: `translate(-200%, -200%) rotate(360deg)` }),
        animate('2s ease-out'),
      ]),
    ]),
  ],
})
export class DiceComponent implements OnInit {
  @Input() num: number
  @Input() icon: IconDefinition
  @Input() disabled: boolean
  @Input() blink: boolean
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
  blinkClass: string
  disabledClass: string

  // constructor() {}

  ngOnInit(): void {
    this.blinkClass = this.blink ? 'blinking' : ''
    this.disabledClass = this.disabled ? 'disabled cursor-unset' : ''
  }

  onClick(): void {
    this.callBackOnClick(this.coordinate[0], this.coordinate[1])
  }
}
