import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { PlayerService } from '../../services/player.service'
import { I18nService } from '../../services/i18n.service'
import { Player } from '../../types'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  player: Player
  validationError = false
  invalidClass = ''
  i18n: I18nService

  private playerId = sessionStorage.getItem('pId')

  constructor(
    private router: Router,
    private playerService: PlayerService,
    private i18nService: I18nService
  ) {
    this.i18n = i18nService
    if (this.playerId) {
      this.router.navigate(['/'])
    }
  }

  ngOnInit(): void {
    this.player = {
      _roomId: 0,
      name: '',
      coordinates: null,
      initialCoordinates: null,
      piece: null,
      cards: [],
      life: 3,
      killedPlayer: 0,
    }
  }

  onSubmit(): void {
    if (this.player.name.trim().length > 0) {
      this.playerService.createPlayer(this.player).subscribe((player) => {
        this.invalidClass = ''
        this.validationError = false
        this.playerService.set(player)
        this.router.navigate(['/'])
      })
    } else {
      this.validationError = true
      this.invalidClass = 'border border-danger'
    }
  }
}
