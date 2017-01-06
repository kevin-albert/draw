/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PicComponent } from './pic.component';
import { ImageService } from '../image.service';
import { MockImageService } from '../test';

describe('PicComponent', () => {
  var component: PicComponent;
  var fixture: ComponentFixture<PicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PicComponent ],
      providers: [
          MockImageService,
          {provide: ImageService, useClass: MockImageService}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have save and delete buttons', async(() => {
    fixture.detectChanges();
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('button.save').textContent).toContain('Save');
    expect(compiled.querySelector('button.delete').textContent).toContain('Delete');
  }));
 
});