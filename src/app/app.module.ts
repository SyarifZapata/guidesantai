import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AboutComponent } from './about/about.component';
import { RouterModule, Routes} from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import {HttpModule} from '@angular/http';
import {DataService} from './data.service';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { UserComponent } from './user/user.component';
import {HttpClientModule} from '@angular/common/http';
import {SettingsComponent} from './settings/settings.component';
import { TwoFAComponent } from './two-fa/two-fa.component';
import { FriendListComponent } from './friend-list/friend-list.component';
import { ChatComponent } from './chat/chat.component';


const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'about', component: AboutComponent},
  {path: 'user', component: UserComponent,
    children: [
      {path: '', component: FriendListComponent}
    ]},
  {path: 'chat/:room_id/:to_id', component: ChatComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'settings', component: SettingsComponent},
  {path: 'twofa', component: TwoFAComponent},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    AboutComponent,
    HomeComponent,
    NotFoundComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent,
    SettingsComponent,
    TwoFAComponent,
    FriendListComponent,
    ChatComponent
  ],
  entryComponents: [
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
