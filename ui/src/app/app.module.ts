import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { PicComponent } from './pic/pic.component';
import { ImageService } from './image.service';

@NgModule({
  declarations: [
    AppComponent,
    PicComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [ ImageService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
