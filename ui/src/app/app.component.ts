import { Component } from '@angular/core';
import { PicComponent } from './pic/pic.component';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  pics = [];
  counter = 0;
  socket:any;

  constructor() {
    this.socket = io('http://localhost:3000')
  }

  add() {
    this.pics.push({localID: this.counter++});
  }

  deletePic(event) {
    var record = this.pics
        .map(e => e.localID)
        .map((lid,i) => ({lid: lid, i: i}))
        .find(pair => pair.lid == event.localID)

    if (record) {
      this.pics.splice(record.i, 1);
    }
  }
}
