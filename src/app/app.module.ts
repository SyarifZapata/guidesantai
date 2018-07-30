import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { UebungenComponent } from './uebungen/uebungen.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    UebungenComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
