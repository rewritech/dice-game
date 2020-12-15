import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DiceOneComponent } from './components/dice/dice-one/dice-one.component';
import { DiceTwoComponent } from './components/dice/dice-two/dice-two.component';
import { DiceThreeComponent } from './components/dice/dice-three/dice-three.component';
import { DiceFourComponent } from './components/dice/dice-four/dice-four.component';
import { DiceFiveComponent } from './components/dice/dice-five/dice-five.component';
import { DiceSixComponent } from './components/dice/dice-six/dice-six.component';
import { RoomComponent } from './views/room/room.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { NewRoomComponent } from './views/new-room/new-room.component';
import { RoomsComponent } from './views/rooms/rooms.component';

@NgModule({
  declarations: [
    AppComponent,
    DiceOneComponent,
    DiceTwoComponent,
    DiceThreeComponent,
    DiceFourComponent,
    DiceFiveComponent,
    DiceSixComponent,
    RoomComponent,
    DashboardComponent,
    NewRoomComponent,
    RoomsComponent
  ],
  imports: [BrowserModule, AppRoutingModule, NgbModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
