import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DiceOneComponent } from './components/dice/dice-one/dice-one.component';
import { DiceTwoComponent } from './components/dice/dice-two/dice-two.component';
import { DiceThreeComponent } from './components/dice/dice-three/dice-three.component';
import { DiceFourComponent } from './components/dice/dice-four/dice-four.component';
import { DiceFiveComponent } from './components/dice/dice-five/dice-five.component';
import { DiceSixComponent } from './components/dice/dice-six/dice-six.component';
import { PlayRoomComponent } from './views/play-room/play-room.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { NewRoomComponent } from './views/new-room/new-room.component';
import { RoomsComponent } from './views/rooms/rooms.component';
import { HowToPlayComponent } from './views/how-to-play/how-to-play.component';
import { WaitingRoomComponent } from './views/waiting-room/waiting-room.component';
import { PlayerCreateModalComponent } from './components/player-create-modal/player-create-modal.component';
import { DashboardButtonComponent } from './components/dashboard-button/dashboard-button.component';

@NgModule({
  declarations: [
    AppComponent,
    DiceOneComponent,
    DiceTwoComponent,
    DiceThreeComponent,
    DiceFourComponent,
    DiceFiveComponent,
    DiceSixComponent,
    PlayRoomComponent,
    DashboardComponent,
    NewRoomComponent,
    RoomsComponent,
    HowToPlayComponent,
    WaitingRoomComponent,
    PlayerCreateModalComponent,
    DashboardButtonComponent,
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
