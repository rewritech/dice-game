import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { DashboardComponent } from './views/dashboard/dashboard.component'
import { HowToPlayComponent } from './views/how-to-play/how-to-play.component'
import { NewRoomComponent } from './views/new-room/new-room.component'
import { PlayRoomComponent } from './views/play-room/play-room.component'
import { RoomsComponent } from './views/rooms/rooms.component'
import { WaitingRoomComponent } from './views/waiting-room/waiting-room.component'
import { LoginComponent } from './views/login/login.component'

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'rooms/new', component: NewRoomComponent },
  { path: 'rooms/:id', component: PlayRoomComponent },
  { path: 'waiting/rooms/:id', component: WaitingRoomComponent },
  { path: 'rooms', component: RoomsComponent },
  { path: 'how-to-play', component: HowToPlayComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
