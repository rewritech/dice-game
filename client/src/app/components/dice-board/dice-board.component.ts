import { Component, Input, OnInit } from '@angular/core'
import { Room, Counter } from '../../types'
import { DiceMapService } from '../../services/dice-map.service'

@Component({
  selector: 'app-dice-info',
  templateUrl: './dice-info.component.html',
  styleUrls: ['./dice-info.component.scss']
})
export class DiceBoardComponent implements OnInit {
  @Input() room: Room
  counter: Counter

  constructor(private diceMapService: DiceMapService) {}

  ngOnInit(): void {
    const { map } = this.room
    this.counter = this.countDice(map)
  }

  private countDice(map: number[][]): Counter {
    const result = this.diceMapService.getCounter()
    const mapRow = this.diceMapService.getMapRow()
    const mapCol = this.diceMapService.getMapCol()

    for (let r = 0; r < mapRow; r += 1) {
      const row = map[r]
      for (let c = 0; c < mapCol; c += 1) {
        const num = row[c]
        result[num] += 1
      }
    }

    return result
  }
}
