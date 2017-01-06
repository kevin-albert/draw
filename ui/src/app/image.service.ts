import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../environments/environment';

import 'rxjs/add/observable/fromEvent';
import * as io from 'socket.io-client';

@Injectable()
export class ImageService {

  private http:Http;
  private socket:any;
  private baseUrl = environment.server;

  private creates: Observable<any>;
  private updates: Observable<any>;
  
  // deletes

  constructor(http:Http) {
    this.socket = io(this.baseUrl);
    this.creates = Observable.fromEvent(this.socket, 'create');
    this.updates = Observable.fromEvent(this.socket, 'draw');
    this.http = http;
  }

  public getAll() {
    return this.http.get(`${this.baseUrl}/all`).map(res => res.json());
  }

  public getCreates() {
    return this.creates;
  }

  public getUpdates() {
    return this.updates;
  }

  public create(data:any) {
    this.socket.emit('create', data);
  }

  public draw(data:any) {
    this.socket.emit('draw', data);
  }

}
