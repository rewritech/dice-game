import { TestBed } from '@angular/core/testing'

import { SocketConnectService } from './socket-connect.service'

describe('SocketConnectService', () => {
  let service: SocketConnectService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(SocketConnectService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
