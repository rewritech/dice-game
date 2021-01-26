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
          icon: coordIcons[[i, j].join('.')]?.piece,
          blink: !!blinkPlayer && this.compare([i, j], blinkPlayer.coordinates),
          checked: false,
          playerName: coordIcons[[i, j].join('.')]?.name,
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
      result[p.coordinates?.join('.')] = { piece: p.piece, name: p?.name || '' }
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

  private newMap(): void {
    for (let i = 0; i < this.MAP_ROW; i += 1) {
      for (let j = 0; j < this.MAP_COL; j += 1) {
        const randomNumber = this.createRandomNumber()
        this.diceMap[i][j] = randomNumber
        this.counter[randomNumber] += 1
      }
    }

    // 스타팅 옆에 있는 주사위는 서로 다르게 한다.
    this.changeStartingSideNum([0, 1], [1, 0])
    this.changeStartingSideNum([0, 8], [1, 9])
    this.changeStartingSideNum([8, 0], [9, 1])
    this.changeStartingSideNum([9, 8], [8, 9])
  }

  private changeStartingSideNum(source, target): void {
    const sourceNum = this.diceMap[source[0]][source[1]]
    const targetNum = this.diceMap[target[0]][target[1]]
    if (sourceNum === targetNum) {
      const dices = [1, 2, 3, 4, 5, 6]
      const i = dices.findIndex((d) => d === sourceNum)
      dices.splice(i, 1)
      const newNum = dices[Math.floor(Math.random() * (this.DICE_MAX - 1))]
      this.counter[targetNum] -= 1
      this.counter[newNum] += 1
      this.diceMap[target[0]][target[1]] = newNum
    }
  }

  getAccessibleArea(
    room: Room,
    selectedCards: number[],
    player: Player
  ): Map[][] {
    const { coordinates, initialCoordinates, cards } = player
    const { map } = room

    // 일단 모두 true(비활성화)인 Map[][] 만든다.
    const pieces = this.createPieces(room, true)
    // 시작 좌표 설정
    const startX = coordinates[0]
    const startY = coordinates[1]

    // 이동가능 좌표 설정
    this.checkAround(pieces, selectedCards, startX, startY, true)

    // 모든 플레이어 시작점 이동 불가
    room.players.forEach((plr) => {
      const initCoord = plr.initialCoordinates
      if (
        !pieces[initCoord[0]][initCoord[1]].disabled &&
        !this.compare(initialCoordinates, initCoord)
      ) {
        pieces[initCoord[0]][initCoord[1]].disabled = true
      }
    })

    if (
      this.compare(initialCoordinates, coordinates) &&
      cards.filter((card) =>
        this.getAroundCard(map, coordinates).includes(card)
      ).length > 0
    ) {
      // 초기 위치에서 움직일 수 있는 카드가 있다면 자기자리 선택 불가
      pieces[startX][startY].disabled = true
    } else {
      // 선택한 카드가 있는 경우 자기자리 선택가능
      pieces[startX][startY].disabled = selectedCards.length <= 0
    }

    return pieces
  }

  private getAroundCard(map: number[][], coord: [number, number]): number[] {
    const x = coord[0]
    const y = coord[1]
    const aroundX = [map[x - 1], map[x + 1]].filter((n) => !!n).map((n) => n[y])
    const aroundY = [map[x][y - 1], map[x][y + 1]].filter((n) => !!n)
    return aroundX.concat(aroundY)
  }

  private checkAround(
    pieces: Map[][],
    cards: number[],
    x: number,
    y: number,
    isFirst: boolean
  ): void {
    // out of range
    if (x < 0 || x > 9 || y < 0 || y > 9) return

    const piece = pieces[x][y]

    // 검사 완료?
    if (piece.checked) return

    //  이동 가능?
    const checkedAccessible = !cards.includes(piece.num)
    // eslint-disable-next-line no-param-reassign
    pieces[x][y].disabled = checkedAccessible
    // eslint-disable-next-line no-param-reassign
    pieces[x][y].checked = true

    // 이동 불가라면 종료
    if (!isFirst && checkedAccessible) return

    this.checkAround(pieces, cards, x - 1, y, false)
    this.checkAround(pieces, cards, x + 1, y, false)
    this.checkAround(pieces, cards, x, y + 1, false)
    this.checkAround(pieces, cards, x, y - 1, false)
  }
}
