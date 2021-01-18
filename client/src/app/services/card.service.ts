import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class CardService {
  private CARD_SET = 10

  private cardDeck: number[]

  // constructor() {}

  createNewCardDeck(): void {
    this.cardDeck = []
    for (let s = 0; s < this.CARD_SET; s += 1) {
      this.cardDeck.push(...this.shuffle([1, 2, 3, 4, 5, 6]))
    }
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

  getCardDeck(): number[] {
    return this.cardDeck
  }
}
