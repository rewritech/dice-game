import { Injectable } from '@angular/core'
import { Counter, Map, Player, Room } from '../types'

@Injectable({
  providedIn: 'root',
})
export class DiceMapService {
  private diceMap: number[][]
  private counter: Counter
  private DICE_MIN = 1
  private DICE_MAX = 6
  private MAP_ROW = 10
  private MAP_COL = 10
  private MIN_COUNT = 10

  constructor() {
    this.diceMap = Array.from(Array(10), () => new Array(10))
    this.counter = this.initializeCounter()
  }

  createNewMap(): void {
    this.counter = this.initializeCounter()
    this.newMap()

    // create new map while filtered element length is zero
    while (
      Object.values(this.counter).filter((n: number) => n < this.MIN_COUNT)
        .length > 0
    ) {
      this.initializeCounter()
      this.newMap()
    }
  }

  getCounter(): Counter {
    return this.counter
  }

  getDiceMap(): number[][] {
    return this.diceMap
  }

  createPieces(room: Room, disabled: boolean): Map[][] {
    const result: Map[][] = Array.from(Array(10), () => new Array(10))
    const { players, map } = room
    const coordIcons = this.createCoordIcon(players)
    map.forEach((row, i) => {
      row.forEach((col, j) => {
        result[i][j] = {
          num: col,
          disabled,
          icon: coordIcons[[i, j].join('.')],
        }
      })
    })
    return result
  }

  private createCoordIcon(players: Player[]) {
    const result = {}
    players.forEach((p: Player) => {
      result[p.coordinates?.join('.')] = p.piece
    })
    return result
  }

  private initializeCounter(): Counter {
    this.counter = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
    return this.counter
  }

  // create random number between 1 and 6
  private createRandomNumber(): number {
    return Math.floor(
      Math.random() * (this.DICE_MAX + 1 - this.DICE_MIN) + this.DICE_MIN
    )
  }

  private newMap() {
    for (let i = 0; i < this.MAP_ROW; i += 1) {
      for (let j = 0; j < this.MAP_COL; j += 1) {
        const randomNumber = this.createRandomNumber()
        this.diceMap[i][j] = randomNumber
        this.counting(randomNumber)
      }
    }
  }

  private counting(num: number) {
    switch (num) {
      case 1:
        this.counter[1] += 1
        break
      case 2:
        this.counter[2] += 1
        break
      case 3:
        this.counter[3] += 1
        break
      case 4:
        this.counter[4] += 1
        break
      case 5:
        this.counter[5] += 1
        break
      case 6:
        this.counter[6] += 1
        break
      default:
        break
    }
  }

  getDiceMin(): number {
    return this.DICE_MIN
  }

  getDiceMax(): number {
    return this.DICE_MAX
  }
}
