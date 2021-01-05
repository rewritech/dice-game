import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { AppRoutingModule } from './app-routing.module'

import { AppComponent } from './app.component'
import { PlayRoomComponent } from './views/play-room/play-room.component'
import { DashboardComponent } from './views/dashboard/dashboard.component'
import { RoomsComponent } from './views/rooms/rooms.component'
import { HowToPlayModalComponent } from './components/how-to-play-modal/how-to-play-modal.component'
import { PlayerEditModalComponent } from './components/player-edit-modal/player-edit-modal.component'
import { NewRoomModalComponent } from './components/new-room-modal/new-room-modal.component'
import { DashboardButtonComponent } from './components/dashboard-button/dashboard-button.component'
import { DiceComponent } from './components/dice/dice.component'
import { ViewDiceComponent } from './components/view-dice/view-dice.component'
import { LoginComponent } from './views/login/login.component'
import { SelectPieceComponent } from './components/select-piece/select-piece.component'
import { HeaderComponent } from './components/header/header.component'
import { ChatComponent } from './components/chat/chat.component'
import { ChatMessageComponent } from './components/chat-message/chat-message.component'
import { PlayerStatusComponent } from './components/player-status/player-status.component'
import { CardComponent } from './components/card/card.component'

@NgModule({
  declarations: [
    AppComponent,
    PlayRoomComponent,
    DashboardComponent,
    RoomsComponent,
    HowToPlayModalComponent,
    PlayerEditModalComponent,
    NewRoomModalComponent,
    DashboardButtonComponent,
    DiceComponent,
    ViewDiceComponent,
    LoginComponent,
    SelectPieceComponent,
    HeaderComponent,
    ChatComponent,
    ChatMessageComponent,
    PlayerStatusComponent,
    CardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    FontAwesomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
