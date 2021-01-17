import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { PlayerService } from './services/player.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'DiceMap'

  private playerId = sessionStorage.getItem('pId')

  constructor(private router: Router, private playerService: PlayerService) {
    if (this.playerId) {
      this.playerService.checkPlayer()
    } else {
      this.router.navigate(['/login'])
    }
  }
}
