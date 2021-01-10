import { Component, OnInit, Input } from '@angular/core'
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { trigger, style, animate, transition } from '@angular/animations'
import { AnimationOption } from '../../types'

@Component({
  selector: 'app-dice',
  templateUrl: './dice.component.html',
  styleUrls: ['./dice.component.scss'],
  animations: [
    trigger('insert', [
      transition(
        ':enter',
        [
          style({ transform: `translate({{x}}%, {{y}}%) rotate(360deg)` }),
          animate('2s ease-out'),
        ],
        { params: { x: -200, y: -200 } }
      ),
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
  animateConfig: AnimationOption

  // constructor() {}

  ngOnInit(): void {
    this.blinkClass = this.blink ? 'blinking' : ''
    this.disabledClass = this.disabled ? 'disabled cursor-unset' : ''
    this.animateConfig = {
      value: ':enter',
      params: {
        x: this.randomCoordinate(),
        y: this.randomCoordinate(),
      },
    }
  }

  onClick(): void {
    this.callBackOnClick(this.coordinate[0], this.coordinate[1])
  }

  private randomCoordinate(): number {
    return Math.floor(Math.random() * 300) - Math.floor(Math.random() * 290)
  }
}
