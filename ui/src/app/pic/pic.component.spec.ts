/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PicComponent } from './pic.component';

describe('PicComponent', () => {
  let component: PicComponent;
  let fixture: ComponentFixture<PicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PicComponent ]
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
    let fixture = TestBed.createComponent(PicComponent);
    fixture.detectChanges();
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('button.save').textContent).toContain('Save');
    expect(compiled.querySelector('button.delete').textContent).toContain('Delete');
  }));
 
   it('should fire picDeleted event when delete is clicked', (done) => {
    let fixture = TestBed.createComponent(PicComponent);
    fixture.detectChanges();
    let compiled = fixture.debugElement.nativeElement;
    let component = fixture.componentInstance;
    let deleteButton = compiled.querySelector('button.delete');
    component.picDeleted.subscribe(event => {
      expect(event.localID).toEqual(component.localID);
      done();
    })
    deleteButton.click();
  });
});