const fs = require('fs');
const Observable = require('rx').Observable;
const uuid = require('node-uuid').v4;
const gm = require('gm');

module.exports.create = create;

function create(imageDir) {

  let data = [];
  let all = () => Observable.from(data);
  let get = id => all().filter(img => img.id == id);
  let genPath = () => `${uuid()}.png`;
  let fileName = p => `${imageDir}/${p}`;
  let logError = msg => console.error.bind(console, msg);

  let worker = {
    
    // Create a blank image and return a record containing its ID / path
    create: () => {
      let img = { id: uuid(), u: [], p: genPath() };
      let createImg = gm(500,350, '#ffffff');
      return makeObservable(createImg.write.bind(createImg, fileName(img.p)))
        .map(ignored => img)
        .doOnNext(img => data.push(img))
        .doOnError(logError('unable to create image:'));
    },

    draw: message => {

      //
      // validate draw messages
      // they should look like:
      // { id: <UUID>, u: [ {c: '#0fac9d', l: [[24,68], [32,40], ... ] }, ... ]}
      // 
      if (!message || typeof message.id != 'string' || !Array.isArray(message.u)) {
        return Observable.throw('invalid message');
      } else {
        message.u.forEach(update => {
          if (typeof update.c != 'string' || update.c.match(/#[0-9a-f]{6}/) == null) {
            return Observable.throw('invalid message');
          }
          if (!Array.isArray(update.l) || 
              update.l.find(point => !Array.isArray(point) || point.length != 2)) {
            return Observable.throw('invalid message');
          }
        });
      }

      return get(message.id).doOnNext(img => img.u = img.u.concat(message.u));
    },

    saveChanges: () => 
      // find images with updates (non-empty update array)
      all().filter(img => img.u)
        .flatMap(img => {

          // create new image file
          let p = genPath();

          // apply each edit
          let edit = gm(fileName(img.p));
          img.u.forEach(u => edit.drawPolyline(...u.l).stroke(u.c));
          
          // write and return an observable
          return makeObservable(edit.write.bind(edit, fileName(p)))
              .flatMap(result => makeObservable(fs.unlink.bind(fs, fileName(img.p))))
              .map(result => img)
              .doOnNext(img => {
                img.p = p;
                img.u = [];
              })
              .doOnError(logError('unable to create image:'));
      })
  };

  return worker;
}

function makeObservable(action) {
  return Observable.create(observer => {
    action((err, result) => {
      if (err) {
        observer.onError(err);
      } else {
        observer.onNext(result);
        observer.onCompleted();
      }
    });
  })
}
