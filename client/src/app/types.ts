import { IconDefinition } from '@fortawesome/free-solid-svg-icons'

export type Player = {
  _id?: string
  _roomId: number
  name: string
  coordinates: [number, number] | null
  initialCoordinates: [number, number] | null
  piece: IconDefinition | null
  cards: number[]
  life: number
  killedPlayer: number
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

export type Map = {
  num: number
  disabled: boolean
  icon: IconDefinition
  blink: boolean
  checked: boolean
  playerName: string
}

export type Message = {
  _id?: string
  _roomId: number
  _playerId: string
  systemMsgStatus: string
  playerName?: string
  content: string
  sendedAt?: string
}

export type PieceBtn = {
  isActive: boolean
  selectedId: string | null
  piece: IconDefinition
}

export type SelectedCard = {
  num: number
  index: number
}

export type Counter = {
  1: number
  2: number
  3: number
  4: number
  5: number
  6: number
}

export type Locale = 'ko' | 'en' | 'ja'

export type AnimationOption = {
  value: string
  params: {
    x: number
    y: number
  }
  target?: [number, number]
}
