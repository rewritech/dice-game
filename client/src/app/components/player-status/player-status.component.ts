import { Component, OnInit, Input } from '@angular/core'
import {
  faSkull,
  faTimes,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-player-status',
  templateUrl: './player-status.component.html',
  styleUrls: ['./player-status.component.scss'],
})
export class PlayerStatusComponent implements OnInit {
  @Input() icon: IconDefinition
  @Input() life: number
  @Input() cards: number
  @Input() blink: boolean
  @Input() isMe: boolean
  @Input() killed: number
  @Input() isScramble: boolean

  blinkClass: string
  skull = faSkull
  times = faTimes

  ngOnInit(): void {
    this.blinkClass = this.blink ? 'blinking' : ''
  }
}
