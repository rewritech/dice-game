import { Component, Input, OnInit } from '@angular/core'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { Room, Counter } from '../../types'
import { DiceMapService } from '../../services/dice-map.service'

@Component({
  selector: 'app-dice-board',
  templateUrl: './dice-board.component.html',
  styleUrls: ['./dice-board.component.scss'],
})
export class DiceBoardComponent implements OnInit {
  @Input() room: Room
  counter: Counter
  times = faTimes

  constructor(private diceMapService: DiceMapService) {}

  ngOnInit(): void {
    // onInit
  }

  ngOnChanges(): void {
    this.updateDiceCount()
  }

  updateDiceCount(): void {
    this.counter = this.diceMapService.getCounter(this.room.map)
  }
}
