/* tslint:disable:no-unused-variable */

import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { PicComponent } from './pic';
import { ImageService } from './image.service';
import { MockImageService } from './test';

describe('App: ImgFailUi', () => {
  var fixture: ComponentFixture<AppComponent>;
  var app: AppComponent;
  var compiled;
  var mockImageService: MockImageService;

  beforeEach(() => {
    mockImageService = new MockImageService();
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        PicComponent
      ],
      providers: [
        MockImageService,
        { provide: ImageService, useValue: mockImageService }
      ]
    });
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.debugElement.componentInstance;
    compiled = fixture.debugElement.nativeElement;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should not show plus option on startup', () => {
    fixture.detectChanges();
    
    expect(compiled.querySelector('h1').textContent).toContain('Image Board');
  });

  it('should load initial picture list', () => {
    mockImageService._all = [
      { id: 'A', p: '00000.png', u: [] },
      { id: 'B', p: '11111.png', u: [] }
    ];

    // first - init the component, make the http call
    fixture.detectChanges();
    // second- create subcomponents from http call
    fixture.detectChanges();

    expect(compiled.querySelectorAll('app-pic').length).toEqual(2);
    expect(app.pics[0]).toEqual({id: 'A', p: '00000.png', u: []});
    expect(app.pics[1]).toEqual({id: 'B', p: '11111.png', u: []});
  });
});