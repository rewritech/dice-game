import { IconDefinition } from '@fortawesome/free-solid-svg-icons'

export type Player = {
  _id?: string
  _roomId: number
  name: string
  coordinates: [number, number] | null
  piece: IconDefinition | null
  cards: number[]
  life: number
}

export type Room = {
  _id?: number
  title: string
  players: Player[]
  playerLimit: number
  map: number[][]
  currentPlayer: Player | string
  status: 'WAIT' | 'PLAYING' | 'END'
  cardDeck: {
    unused: number[]
    used: number[]
  }
}

export type PieceBtn = {
  isActive: boolean
  selectedId: string | null
  piece: IconDefinition
}

export type Counter = {
  1: number
  2: number
  3: number
  4: number
  5: number
  6: number
}
