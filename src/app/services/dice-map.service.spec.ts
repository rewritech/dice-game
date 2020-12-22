import { TestBed } from '@angular/core/testing'

import { DiceMapService } from './dice-map.service'

describe('DiceMapService', () => {
  let service: DiceMapService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(DiceMapService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
