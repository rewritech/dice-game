import { Component, OnInit, Input } from '@angular/core'
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { trigger, style, animate, transition } from '@angular/animations'
import { AnimationOption } from '../../types'
import { DiceMapService } from '../../services/dice-map.service'

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
          animate('1s ease-out'),
        ],
        { params: { x: -200, y: -200 } }
      ),
    ]),
    trigger('moveAnimate', [
      transition(
        '* => move',
        [
          style({ transform: `translate({{x}}%, {{y}}%)` }),
          animate('0.5s ease-out'),
        ],
        { params: { x: 0, y: 0 } }
      ),
      transition(
        '* => bomb',
        [
          style({ transform: `translate({{x}}%, {{y}}%)` }),
          animate('0.2s'),
          style({ transform: `scale(4)` }),
          animate('0.3s'),
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
  @Input() isMe: boolean
  @Input() callBackOnClick: (x: number, y: number) => void
  @Input() aniConfig: AnimationOption
  @Input() playerName: string

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
  insertConfig: AnimationOption = null
  moveConfig: AnimationOption = null

  constructor(private diceMapService: DiceMapService) {}

  ngOnInit(): void {
    this.blinkClass = this.blink ? 'blinking' : ''
    this.disabledClass = this.disabled ? 'disabled cursor-unset' : ''
    if (this.aniConfig?.value === 'insert') {
      this.insertConfig = {
        value: 'insert',
        params: {
          x: this.randomCoordinate(),
          y: this.randomCoordinate(),
        },
      }
    } else if (
      ['move', 'bomb'].includes(this.aniConfig?.value) &&
      this.diceMapService.compare(this.coordinate, this.aniConfig.target)
    ) {
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
