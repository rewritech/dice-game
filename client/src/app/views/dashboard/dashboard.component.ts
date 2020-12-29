import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { PlayerService } from '../../services/player.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private playerId = sessionStorage.getItem('pId')

  constructor(private playerService: PlayerService, private router: Router) {}

  ngOnInit(): void {}

  logout(): void {
    this.playerService.deletePlayer(this.playerId).subscribe(() => {
      sessionStorage.removeItem('pId')
      this.router.navigate(['/login'])
    })
  }
}
