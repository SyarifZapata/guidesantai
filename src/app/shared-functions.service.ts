import { Injectable } from '@angular/core';

declare var responsiveVoice: any;

@Injectable({
  providedIn: 'root'
})
export class SharedFunctionsService {

  currentUser = '';

  constructor() { }

  playVoice(arg){
    responsiveVoice.speak(arg, 'Deutsch Female', {rate: 0.8});
  }
  setCurrentUser(user){
    this.currentUser = user;
  }

  getCurrentUser(){
    return this.currentUser;
  }
}
