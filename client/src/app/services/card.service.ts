import { Injectable } from '@angular/core'
import { DiceMapService } from './dice-map.service'

@Injectable({
  providedIn: 'root',
})
export class CardService {
  private CARD_SET = 10

  private cardDeck: number[]

  constructor(private diceMapService: DiceMapService) {}

  createNewCardDeck(): void {
    const diceMin = this.diceMapService.getDiceMin()
    const diceMax = this.diceMapService.getDiceMax()
    const newCardDec = []

    for (let s = 0; s < this.CARD_SET; s += 1) {
      for (let i = diceMin; i <= diceMax; i += 1) {
        newCardDec.push(i)
      }
    }

    this.cardDeck = this.suffle(newCardDec)
  }

  private suffle(arr: number[]): number[] {
    const result = arr.slice()
    const arrLen = result.length

    let currentIdx = arrLen - 1
    while (currentIdx >= 0) {
      const randomIdx = Math.floor(Math.random() * (arrLen - 1))

      const tempVal = result[currentIdx]
      result[currentIdx] = arr[randomIdx]
      result[randomIdx] = tempVal

      currentIdx -= 1
    }

    return result
  }

  getCardDeck(): number[] {
    return this.cardDeck
  }
}
