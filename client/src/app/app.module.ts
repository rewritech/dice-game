import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { PlayRoomComponent } from './views/play-room/play-room.component'
import { DashboardComponent } from './views/dashboard/dashboard.component'
import { NewRoomComponent } from './views/new-room/new-room.component'
import { RoomsComponent } from './views/rooms/rooms.component'
import { HowToPlayComponent } from './views/how-to-play/how-to-play.component'
import { WaitingRoomComponent } from './views/waiting-room/waiting-room.component'
import { PlayerEditModalComponent } from './components/player-edit-modal/player-edit-modal.component'
import { DashboardButtonComponent } from './components/dashboard-button/dashboard-button.component'
import { DiceComponent } from './components/dice/dice.component'
import { LoginComponent } from './views/login/login.component';
import { UserInfoComponent } from './components/user-info/user-info.component'

@NgModule({
  declarations: [
    AppComponent,
    PlayRoomComponent,
    DashboardComponent,
    NewRoomComponent,
    RoomsComponent,
    HowToPlayComponent,
    WaitingRoomComponent,
    PlayerEditModalComponent,
    DashboardButtonComponent,
    DiceComponent,
    LoginComponent,
    UserInfoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
