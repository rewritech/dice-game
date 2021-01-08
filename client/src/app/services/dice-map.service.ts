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
      this.counter = this.initializeCounter()
      this.newMap()
    }
  }

  getCounter(map: number[][]): Counter {
    const result: Counter = this.initializeCounter()
    map.forEach((row) => {
      row.forEach((col) => {
        result[col] += 1
      })
    })
    return result
  }

  getDiceMap(): number[][] {
    return this.diceMap
  }

  getDiceMin(): number {
    return this.DICE_MIN
  }

  getDiceMax(): number {
    return this.DICE_MAX
  }

  createPieces(room: Room, disabled: boolean): Map[][] {
    const result: Map[][] = Array.from(Array(10), () => new Array(10))
    const { currentPlayer, players, map } = room
    const blinkPlayer = players.find((p) => p._id === currentPlayer)
    const coordIcons = this.createCoordIcon(players)
    map.forEach((row, i) => {
      row.forEach((col, j) => {
        result[i][j] = {
          num: col,
          disabled,
          icon: coordIcons[[i, j].join('.')],
          blink: this.compare([i, j], blinkPlayer.coordinates),
        }
      })
    })
    return result
  }

  // 두 배열을 비교한다. 좌표 비교할 때 사용함
  compare(x: number[], y: number[]): boolean {
    return JSON.stringify(x) === JSON.stringify(y)
  }

  private createCoordIcon(players: Player[]) {
    const result = {}
    players.forEach((p: Player) => {
      result[p.coordinates?.join('.')] = p.piece
    })
    return result
  }

  private initializeCounter(): Counter {
    return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
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
        this.counter[randomNumber] += 1
      }
    }
  }
}
