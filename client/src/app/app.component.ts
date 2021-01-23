import { Component } from '@angular/core'
import { PlayerService } from './services/player.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'DiceMap'

  constructor(private playerService: PlayerService) {
    this.playerService.checkPlayer()
  }
}
