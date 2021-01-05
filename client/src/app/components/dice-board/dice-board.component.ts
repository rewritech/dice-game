import { Component, Input, OnInit } from '@angular/core'
import { Room, Counter } from '../../types'

@Component({
  selector: 'app-dice-info',
  templateUrl: './dice-info.component.html',
  styleUrls: ['./dice-info.component.scss']
})
export class DiceBoardComponent implements OnInit {
  @Input() room: Room
  counter: Counter

  constructor() {}

  ngOnInit(): void {
    const { map } = this.room
    this.counter = countDice(map)
  }

  countDice(map: number[][]): Counter {
    return {}
  }
}
