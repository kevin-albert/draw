import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../environments/environment';

import { PicComponent } from './pic/pic.component';
import { ImageService } from './image.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
  pics = [];
  imageService: ImageService;
  loaded:boolean = false;

  constructor(imageService: ImageService) {
    this.imageService = imageService;
  }

  ngOnInit() {
    this.imageService.getAll()
        .subscribe(all => {
          this.pics = all;
          this.imageService.getCreates().subscribe(this.onCreate.bind(this));
          this.loaded = true;
        }, error => {
          // TODO better error handling
          console.error('error loading initial image list', error);
          this.imageService.getCreates().subscribe(this.onCreate.bind(this));
        });
  }

  add() {
    this.imageService.create({});
  }

  onCreate(data) {
    console.log(`onCreate: ${JSON.stringify(data, null, 2)}`);
    this.pics.push(data);
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
