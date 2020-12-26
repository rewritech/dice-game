export type Player = {
  _id?: number
  _roomId: number
  name: string
}

export type Room = {
  _id?: number
  title: string
  players?: Player[]
  playerLimit: number
  map: number[][]
}

export type Counter = {
  1: number
  2: number
  3: number
  4: number
  5: number
  6: number
}
