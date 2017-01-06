import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { environment } from '../../environments/environment';
import { ImageService } from '../image.service';

@Component({
  selector: 'app-pic',
  templateUrl: './pic.component.html',
  styleUrls: ['./pic.component.css']
})
export class PicComponent implements OnInit {

  @Input()
  public id:string;

  @Input()
  public path:string;

  @Input()
  public initialChanges:any[];

  private nativeElement:any;

  width = 500;
  height = 350;
  drawState = false;
  lastCoords = [0, 0];
  pending = [];
  numUpdates = 0;

  ctx:any;
  canvas:any;
  imageService:ImageService;

  constructor(element:ElementRef, imageService:ImageService) {
    this.nativeElement = element.nativeElement;
    this.imageService = imageService;
  }

  ngOnInit() {
    this.canvas = this.nativeElement.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');
    let image = new Image();
    image.src = `${environment.server}/img/${this.path}`;
    image.onload = () => {
      this.ctx.drawImage(image, 0, 0);
      if (this.initialChanges.length) {
        this.initialChanges.forEach(u => this.renderPath(u.l, u.c));
      }
      this.imageService.getUpdates()
        .filter(update => update.id == this.id)
        .subscribe(update => {
          update.u.forEach(line => this.renderPath(line.l, line.c));
        });
    };
  }

  drawStart(event) {
    this.ctx.beginPath();
    this.lastCoords = this.getRelativeCoords(event);
    this.drawState = true;
  }

  drawMove(event) {
    if (this.drawState) {
      let point = this.getRelativeCoords(event);
      let path = [this.lastCoords, point];
      this.renderPath(path, '#000000');
      if (!this.numUpdates) {
        this.pending.push({l:[this.lastCoords], c: '#000000'})
      }
      this.pending[this.pending.length-1].l.push(point);
      ++this.numUpdates;

      if (this.numUpdates > 10) {
        this.flush();
      }

      this.lastCoords = point;
    }
  }

  drawEnd(event) {
    this.drawState = false;
    this.flush();
  }

  renderPath(path, color) {
    if (path.length > 1) {
      this.ctx.beginPath();
      this.ctx.moveTo(...path[0]);
      path.slice(1).forEach(coords => this.ctx.lineTo(...coords));
      this.ctx.strokeStyle = color;
      this.ctx.stroke();
    }
  }

  private flush() {
    if (this.numUpdates) {
      this.imageService.draw({id: this.id, u: this.pending});
      this.pending = [];
      this.numUpdates = 0;
    }
  }

  private getRelativeCoords(event) {
    return [ 
        event.pageX - this.canvas.offsetLeft, 
        event.pageY - this.canvas.offsetTop
     ]
  }
}
