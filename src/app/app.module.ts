import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { UebungenComponent } from './uebungen/uebungen.component';
import { AboutComponent } from './about/about.component';
import { RouterModule, Routes} from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { UebungTextToSpeechComponent } from './uebung-text-to-speech/uebung-text-to-speech.component';
import { ChoosenImgComponent } from './uebung-text-to-speech/choosen-img/choosen-img.component';
import { DecorationComponent } from './navbar/decoration/decoration.component';
import { ImgCategoryComponent } from './uebung-text-to-speech/img-category/img-category.component';
import { ImgListComponent } from './uebung-text-to-speech/img-category/img-list/img-list.component';
import {SharedFunctionsService} from './shared-functions.service';
import {HttpModule} from '@angular/http';
import {DataService} from './data.service';


const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'about', component: AboutComponent},
  {path: 'uebungen', component: UebungenComponent,
    children: [
      {path: 'category/:id', component: ImgListComponent},
      {path: '', component: ImgCategoryComponent}
    ]},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    UebungenComponent,
    AboutComponent,
    HomeComponent,
    NotFoundComponent,
    UebungTextToSpeechComponent,
    ChoosenImgComponent,
    DecorationComponent,
    ImgCategoryComponent,
    ImgListComponent,
  ],
  entryComponents: [
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpModule
  ],
  providers: [
    SharedFunctionsService,
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
