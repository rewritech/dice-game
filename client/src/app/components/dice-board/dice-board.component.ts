import { Component, Input, OnInit } from '@angular/core'
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

  constructor(private diceMapService: DiceMapService) {}

  ngOnInit(): void {
    this.updateDiceCount()
  }

  ngOnChanges(): void {
    this.updateDiceCount()
  }
  updateDiceCount(): void {
    this.counter = this.diceMapService.getCounter()
  }
}
