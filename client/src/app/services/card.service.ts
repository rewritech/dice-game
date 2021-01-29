import { Injectable } from '@angular/core'
import { Mode } from '../types'

@Injectable({
  providedIn: 'root',
})
export class CardService {
  private CARD_SET = 10

  private baseCards = [1, 2, 3, 4, 5, 6]
  private itemCards = [7, 8, 9]
  private candyItemCards = [7, 9]

  createNewCardDeck(mode: Mode): number[] {
    const cardDeck: number[] = []
    let base = this.baseCards.concat(this.baseCards)
    if (mode.item) {
      base = base.concat(mode.scramble ? this.candyItemCards : this.itemCards)
    }

    for (let s = 0; s < this.CARD_SET; s += 1) {
      cardDeck.push(...this.shuffle(base))
    }
    return cardDeck
  }

  private shuffle(arr: number[]): number[] {
    const result = arr.slice()

    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1))
      const t = result[i]
      result[i] = result[j]
      result[j] = t
    }

    return result
  }
}
