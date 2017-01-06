/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { PicComponent } from './pic/pic.component';

describe('App: ImgFailUi', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        PicComponent
      ],
    });
  });

  it('should create the app', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should render title in a h1 tag', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Image Board');
  }));

  it('should remove picture when deleted', () => {
    let fixture = TestBed.createComponent(AppComponent);
    
    // add 3 pics
    let component = fixture.componentInstance;
    component.add();
    component.add();
    component.add();

    // verify that they were added
    fixture.detectChanges();
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll('.pic').length).toBe(3)
    expect(component.pics.length).toBe(3);
    
    // remove one
    compiled.querySelectorAll('button.delete')[1].click();
    fixture.detectChanges();

    // verify that its removed
    expect(component.pics.length).toBe(2);
    expect(compiled.querySelectorAll('.pic').length).toBe(2)
  });

  it('should remove final picture when deleted', () => {
    let fixture = TestBed.createComponent(AppComponent);
    
    // add 3 pics
    let component = fixture.componentInstance;
    component.add();
    component.add();
    component.add();
  
    // verify that they were added
    fixture.detectChanges();
  
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll('.pic').length).toBe(3)
    expect(component.pics.length).toBe(3);
  
    for (var i = 0; i < 3; ++i) {
      // remove one
      compiled.querySelectorAll('button.delete')[0].click();
      fixture.detectChanges();
    }

    // verify that its removed
    expect(component.pics.length).toBe(0);
    expect(compiled.querySelectorAll('.pic').length).toBe(0)
  });
});
