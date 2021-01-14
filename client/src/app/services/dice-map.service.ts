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

  getAccessibleArea(
    map: number[][],
    cards: number[],
    coordinates: number[]
  ): boolean[][] {
    const rowIdx = coordinates[0]
    const colIdx = coordinates[1]

    const accessibles = this.getAccessibles(map, cards)
    const accessibleDiceArea = Array.from(
      Array(this.MAP_ROW),
      () => new Array(this.MAP_COL)
    )

    this.checkAround(accessibleDiceArea, accessibles, rowIdx, colIdx)

    // 자기자리 이동 가능
    accessibles[rowIdx][colIdx] = true

    // printMap(accessibleDiceArea)

    return accessibleDiceArea
  }

  private getAccessibles(inputMap: number[][], cards: number[]): boolean[][] {
    const result = Array.from(
      Array(this.MAP_ROW),
      () => new Array(this.MAP_COL)
    )

    for (let r = 0; r < this.MAP_ROW; r += 1) {
      for (let c = 0; c < this.MAP_COL; c += 1) {
        const diceNum = inputMap[r][c]
        const accessible = cards.includes(diceNum)
        result[r][c] = accessible
      }
    }

    return result
  }

  private checkAround(
    accessibleDiceArea: boolean[][],
    accessibleMap: boolean[][],
    rowIdx: number,
    colIdx: number
  ): void {
    // 다이스 부재?
    if (rowIdx < 0 || rowIdx > 9 || colIdx < 0 || colIdx > 9) {
      return
    }

    // 검사 완료?
    const checked = typeof accessibleDiceArea[rowIdx][colIdx] === 'boolean'
    if (checked) {
      return
    }

    //  이동 가능?
    const checkedAccessible = accessibleMap[rowIdx][colIdx]
    // eslint-disable-next-line no-param-reassign
    accessibleDiceArea[rowIdx][colIdx] = checkedAccessible
    if (!checkedAccessible) {
      return
    }

    this.checkAround(accessibleDiceArea, accessibleMap, rowIdx - 1, colIdx)
    this.checkAround(accessibleDiceArea, accessibleMap, rowIdx + 1, colIdx)
    this.checkAround(accessibleDiceArea, accessibleMap, rowIdx, colIdx + 1)
    this.checkAround(accessibleDiceArea, accessibleMap, rowIdx, colIdx - 1)
  }

  private printMap(inputMap): void {
    for (let i = 0; i < this.MAP_ROW; i += 1) {
      let str = ''
      for (let j = 0; j < this.MAP_COL; j += 1) {
        let el = inputMap[i][j]
        el = el === true ? (el += ' ') : el
        el = el === undefined ? '-----' : el
        str += el
        str += ' '
      }
      // eslint-disable-next-line no-console
      console.log(str)
    }
    // eslint-disable-next-line no-console
    console.log('')
  }
}
