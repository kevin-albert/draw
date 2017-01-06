import { Http } from '@angular/http';
import { Observable, Subject } from 'rxjs/Rx';
import { ImageService } from '../image.service'


export class MockImageService extends ImageService {
  
  public _all = [];
  public _creates:Subject<any> = new Subject<any>();
  public _updates:Subject<any> = new Subject<any>();
  public _created = [];
  public _updated = [];

  public constructor() { super(null); }

  public getAll() { return Observable.from([this._all]); }
  public getCreates() { return this._creates; }
  public getUpdates() { return this._updates; }
  public create(data:any) { this._created.push(data); }
  public update(data:any) { this._updated.push(data); }
}