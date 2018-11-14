import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import {Message} from './utility/message';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket = io();

  public online(username){
    this.socket.emit('username', username);
  }

  public send(message: Message): void {
    this.socket.emit('message', message);
  }

  public sendFeedback(name): void {
    this.socket.emit('typing', name);
  }

  public onMessage(): Observable<Message> {
    return new Observable<Message>(observer => {
      this.socket.on('message', (data: Message) => observer.next(data));
    });
  }

  public onEvent(event: Event): Observable<any> {
    return new Observable<Event>(observer => {
      this.socket.on(event, () => observer.next());
    });
  }

  public onFeedback(): Observable<string> {
    return new Observable<string>(observer => {
      this.socket.on('typing', (data: string) => observer.next(data));
    });
  }
}
