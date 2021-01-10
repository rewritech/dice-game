import { Component, OnInit, Input } from '@angular/core'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'

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

  blinkClass: string

  // constructor() {}

  ngOnInit(): void {
    this.blinkClass = this.blink ? 'blinking' : ''
  }
}
