import {Injectable} from '@angular/core';
import * as Echo from 'laravel-echo';
import * as io from 'socket.io-client';
import {environment} from '../../environments/environment';
import {TokenStorageService} from '../token-storage.service';
import {Observable, Subject} from 'rxjs';
import {filter, map} from 'rxjs/operators';

@Injectable()
export class EchoService {

  private echo: Echo;

  private socketEvents$ = new Subject<SocketEvent>();

  constructor(private tokenStorageService: TokenStorageService) {
    this.echo = window['Echo'] = new Echo({
      client: io,
      broadcaster: 'socket.io',
      host: environment.apiHost,
      path: '/ws',
      auth: {headers: {'Authorization': 'Bearer ' + this.tokenStorageService.token()}},
    });
  }

  privateChannel<T>(channelName: string, eventName: string): Observable<T> {

    this.echo.private(channelName).listen(eventName, data => {
      this.socketEvents$.next({channel: channelName, name: eventName, payload: data});
    });

    return this.socketEvents$.asObservable().pipe(
      filter(event => event.channel === channelName && event.name === eventName),
      map(event => event.payload.data)
    );
  }

  leave(channelName: string) {
    this.echo.leave(channelName);
  }
}

interface SocketEvent {
  channel: string;
  name: string;
  payload: any;
}
