import { Injectable } from '@angular/core';

declare var responsiveVoice: any;

@Injectable({
  providedIn: 'root'
})
export class SharedFunctionsService {

  constructor() { }

  playVoice(arg){
    responsiveVoice.speak(arg, 'Deutsch Female', {rate: 0.8});
  }
}
