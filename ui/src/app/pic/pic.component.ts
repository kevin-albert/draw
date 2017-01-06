import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';

@Component({
  selector: 'app-pic',
  templateUrl: './pic.component.html',
  styleUrls: ['./pic.component.css']
})
export class PicComponent implements OnInit {

  @Input()
  public localID = 0;

  @Output()
  public picDeleted = new EventEmitter()

  private nativeElement:any;

  width = 500;
  height = 350;
  drawState = false;

  ctx:any;
  canvas:any;

  constructor(element:ElementRef) {
    this.nativeElement = element.nativeElement;
  }

  ngOnInit() {
    this.canvas = this.nativeElement.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  save() {
    let data = this.canvas.toDataURL();
    console.log(`saved: ${data}`);
  }

  delete() {
    this.picDeleted.emit({localID: this.localID});
  }

  drawStart(event) {
    this.ctx.beginPath();
    this.ctx.moveTo(...this.getRelativeCoords(event));
    this.drawState = true;
  }

  drawMove(event) {
    if (this.drawState) {
      this.ctx.lineTo(...this.getRelativeCoords(event));
      this.ctx.stroke();
    }
  }

  drawEnd(event) {
    this.drawState = false;
  }

  private getRelativeCoords(event) {
    return [ 
        event.pageX - this.canvas.offsetLeft, 
        event.pageY - this.canvas.offsetTop
     ]
  }
}
