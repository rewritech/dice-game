import { Component, OnInit, Input } from '@angular/core'
import { faSkull, IconDefinition } from '@fortawesome/free-solid-svg-icons'

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
  @Input() killed: number

  blinkClass: string
  skull = faSkull

  // constructor() {}

  ngOnInit(): void {
    this.blinkClass = this.blink ? 'blinking' : ''
  }
}
