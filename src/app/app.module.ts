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
import { PlayerCreateModalComponent } from './components/player-create-modal/player-create-modal.component'
import { DashboardButtonComponent } from './components/dashboard-button/dashboard-button.component';
import { PlayerComponent } from './components/player/player.component';
import { MessageComponent } from './components/message/message.component';
import { DiceAllComponent } from './components/dice-all/dice-all.component'

@NgModule({
  declarations: [
    AppComponent,
    PlayRoomComponent,
    DashboardComponent,
    NewRoomComponent,
    RoomsComponent,
    HowToPlayComponent,
    WaitingRoomComponent,
    PlayerCreateModalComponent,
    DashboardButtonComponent,
    PlayerComponent,
    MessageComponent,
    DiceAllComponent,
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
