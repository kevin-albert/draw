const Worker = require('../app/worker');
const Observable = require('rx').Observable;
const fs = require('fs');

const IMG_DIR = '/tmp/draw-test';

jasmine.getEnv().defaultTimeoutInterval = 100;

if (!fs.existsSync(IMG_DIR)) 
  fs.mkdirSync(IMG_DIR);

afterEach(() => {
  console.log('cleaning up test files');
  if (fs.existsSync(IMG_DIR)) {
    fs.readdirSync('/tmp/draw-test')
      .forEach(f => fs.unlinkSync(`${IMG_DIR}/${f}`));
  }
  fs.rmdirSync(IMG_DIR);
})

describe('Worker', () => {

  it('should create a new record in the db', done => {
    let worker = Worker.create(IMG_DIR);
    worker.create().subscribe(result => {
      expect(typeof result.id).toEqual('string');
      expect(result.u).toEqual([])
      expect(fs.existsSync(`${IMG_DIR}/${result.p}`)).toBeTruthy();
      done();
    });
  });

  it('should update a record with changes', done => {
    let worker = Worker.create(IMG_DIR);    
    let u = [{
      l: [[0,0],[10,0],[10,10]],
      c: '#000000'
    }];

    worker.create()
      .flatMap(img => worker.draw({ id: img.id, u: u }))
      .subscribe(result => {
        expect(result.u).toEqual(u);
        done();
      }, error => fail(error));
  });

  it('should validate draw messages', done => {
    let worker = Worker.create(IMG_DIR);

    let invalidUpdates = [undefined, null, {}, 100, 'hello?', [], true, false,
        {id: {message: 'YOLO'}}, {id:'X'}, {id: 'X',u:[{}]},
        {id: 'X', u: [{c:'0xffffff',l:[[0,0],[10,10]]}]},
        {id: 'X', u: [{c:'#ffffff',l:[[0,0],[10,10],1]}]},
        done
    ];

    Observable.catch(
        Observable.from(invalidUpdates).flatMap(worker.draw),
        Observable.just('ok'))
      .subscribe(
        next => { if (next != 'ok') fail('invalid input was processed'); },
        error => fail(error),
        () => done()
      );
  });

  it('should not broadcast changes when image does not exist', done => {
    let worker = Worker.create(IMG_DIR);
    worker.draw({ id: 'XXXXX', u: [{l:[[0,0],[100,100]],c:'#ff0000'}] })
        .isEmpty()
        .subscribe(result => {
          expect(result).toBe(true);
          done();
        }, error => fail(error))
  })

  it('should write updates to an image', done => {
    let worker = Worker.create(IMG_DIR);
    let u = [{
        l: [[0,0],[10,0],[10,10]],
        c: '#000000'
      }, {
        l: [[100,50],[107,200]],
        c: '#00eeff'
      }];

    var p0;
    worker.create()
      .flatMap(img => worker.draw({ id: img.id, u: u }))
      .doOnNext(img => p1 = img.p)
      .flatMap(img => worker.saveChanges())
      .subscribe(img => {
        console.log('')
        expect(img.u).toEqual([]);
        expect(img.p).toBeTruthy();
        expect(img.p).not.toEqual(p0);
        expect()
        done();
      }, error => fail(error));
  })
});

