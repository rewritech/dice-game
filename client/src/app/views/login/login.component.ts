import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { PlayerService } from '../../services/player.service'
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

  private playerId = localStorage.getItem('pId')

  constructor(private router: Router, private playerService: PlayerService) {
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
      this.playerService.createPlayer(this.player).subscribe((res) => {
        this.invalidClass = ''
        this.validationError = false
        localStorage.setItem('pId', res._id)
        this.router.navigate(['/'])
      })
    } else {
      this.validationError = true
      this.invalidClass = 'border border-danger'
    }
  }
}
