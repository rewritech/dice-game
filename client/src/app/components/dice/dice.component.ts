import { Component, OnInit, Input } from '@angular/core'
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { trigger, style, animate, transition, state } from '@angular/animations'
import { AnimationOption } from '../../types'

@Component({
  selector: 'app-dice',
  templateUrl: './dice.component.html',
  styleUrls: ['./dice.component.scss'],
  animations: [
    trigger('insertAnimate', [
      transition(
        '* => insert',
        [
          style({ transform: `translate({{x}}%, {{y}}%) rotate(360deg)` }),
          animate('2s ease-out'),
        ],
        { params: { x: -200, y: -200 } }
      ),
    ]),
    trigger('moveAnimate', [
      // state('move', style({ transform: `translate({{x}}px, {{y}}px)` }), {
      //   params: { x: 0, y: 0 },
      // }),
      transition(
        '* => move',
        [
          style({ transform: `translate({{x}}%, {{y}}%)` }),
          animate('2s ease-out'),
        ],
        { params: { x: 0, y: 0 } }
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
  @Input() aniConfig: AnimationOption

  colors = [
    'btn-success',
    'btn-warning',
    'btn-secondary',
    'btn-danger',
    'btn-info',
    'btn-primary',
  ]
  blinkClass: string
  iconColorClass: string
  disabledClass: string
  insertConfig: AnimationOption = null
  moveConfig: AnimationOption = null

  // constructor() {}

  ngOnInit(): void {
    this.blinkClass = this.blink ? 'blinking-dice' : ''
    this.iconColorClass = this.blink ? '' : 'icon-color'
    this.disabledClass = this.disabled ? 'disabled cursor-unset' : ''
    if (this.aniConfig?.value === 'insert') {
      this.insertConfig = {
        value: 'insert',
        params: {
          x: this.randomCoordinate(),
          y: this.randomCoordinate(),
        },
      }
    } else {
      this.moveConfig = this.aniConfig
    }
  }

  onClick(): void {
    this.callBackOnClick(this.coordinate[0], this.coordinate[1])
  }

  private randomCoordinate(): number {
    return Math.floor(Math.random() * 300) - Math.floor(Math.random() * 290)
  }
}
