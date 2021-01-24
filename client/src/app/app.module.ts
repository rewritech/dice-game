import { BrowserModule } from '@angular/platform-browser'
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AppRoutingModule } from './app-routing.module'

import { AppComponent } from './app.component'
import { PlayRoomComponent } from './views/play-room/play-room.component'
import { DashboardComponent } from './views/dashboard/dashboard.component'
import { RoomsComponent } from './views/rooms/rooms.component'
import { HowToPlayModalComponent } from './components/how-to-play-modal/how-to-play-modal.component'
import { PlayerEditModalComponent } from './components/player-edit-modal/player-edit-modal.component'
import { NewRoomModalComponent } from './components/new-room-modal/new-room-modal.component'
import { DiceComponent } from './components/dice/dice.component'
import { ViewDiceComponent } from './components/view-dice/view-dice.component'
import { LoginComponent } from './views/login/login.component'
import { SelectPieceComponent } from './components/select-piece/select-piece.component'
import { HeaderComponent } from './components/header/header.component'
import { ChatComponent } from './components/chat/chat.component'
import { ChatMessageComponent } from './components/chat-message/chat-message.component'
import { PlayerStatusComponent } from './components/player-status/player-status.component'
import { CardComponent } from './components/card/card.component'
import { DiceBoardComponent } from './components/dice-board/dice-board.component'
import { SelectI18nComponent } from './components/select-i18n/select-i18n.component'
import { WaitingRoomComponent } from './components/waiting-room/waiting-room.component'
import { BoardComponent } from './components/board/board.component'
import { ConsoleComponent } from './components/console/console.component'
import { EndGameModalComponent } from './components/end-game-modal/end-game-modal.component'

@NgModule({
  declarations: [
    AppComponent,
    PlayRoomComponent,
    DashboardComponent,
    RoomsComponent,
    HowToPlayModalComponent,
    PlayerEditModalComponent,
    NewRoomModalComponent,
    DiceComponent,
    ViewDiceComponent,
    LoginComponent,
    SelectPieceComponent,
    HeaderComponent,
    ChatComponent,
    ChatMessageComponent,
    PlayerStatusComponent,
    CardComponent,
    DiceBoardComponent,
    SelectI18nComponent,
    WaitingRoomComponent,
    BoardComponent,
    ConsoleComponent,
    EndGameModalComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    FontAwesomeModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
