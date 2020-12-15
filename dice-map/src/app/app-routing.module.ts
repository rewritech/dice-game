import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { NewRoomComponent } from './views/new-room/new-room.component';
import { RoomComponent } from './views/room/room.component';
import { RoomsComponent } from './views/rooms/rooms.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'room/new', component: NewRoomComponent },
  { path: 'rooms', component: RoomsComponent },
  { path: 'room/:id', component: RoomComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
