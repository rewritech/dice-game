import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DiceOneComponent } from './dice/dice-one/dice-one.component';
import { DiceTwoComponent } from './dice/dice-two/dice-two.component';
import { DiceThreeComponent } from './dice/dice-three/dice-three.component';
import { DiceFourComponent } from './dice/dice-four/dice-four.component';
import { DiceFiveComponent } from './dice/dice-five/dice-five.component';
import { DiceSixComponent } from './dice/dice-six/dice-six.component';
import { RoomComponent } from './room/room.component';
import { DashboardComponent } from './dashboard/dashboard.component';

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
  ],
  imports: [BrowserModule, AppRoutingModule, NgbModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
