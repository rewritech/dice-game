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

  path = window.location.pathname

  private playerId = localStorage.getItem('pId')

  constructor(private router: Router, private playerService: PlayerService) {
    if (this.playerId) {
      this.playerService.getPlayer(this.playerId).subscribe((player) => {
        if (!player) {
          localStorage.removeItem('pId')
          this.router.navigate(['/login'])
        }
      })
    } else {
      this.router.navigate(['/login'])
    }
  }
}
