import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import {Message} from './utility/message';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket;

  public initSocket(): void {
    this.socket = io();
  }

  public send(message: Message): void {
    this.socket.emit('message', message);
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
}
