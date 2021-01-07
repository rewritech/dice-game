import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { DashboardComponent } from './views/dashboard/dashboard.component'
import { PlayRoomComponent } from './views/play-room/play-room.component'
import { RoomsComponent } from './views/rooms/rooms.component'
import { LoginComponent } from './views/login/login.component'

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'rooms/:id', component: PlayRoomComponent },
  { path: 'rooms', component: RoomsComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
