const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');

const Observable = require('rx').Observable;

module.exports.create = create;

function create(worker, port, imageDir) {
  let app = express()
    .set('title', 'DRAW')
    .set('json spaces', 2)
    .set('x-powered-by', false)
    .set('strict routing', true)
    .use(bodyParser.json())
    .use(cors())
    .get('/', (req, res) => res.end('ok'))
    .get('/all', (req, res) => 
      worker.all().toArray().subscribe(
          res.json.bind(res), 
          error => console.error('init error:', error)))
    .use('/img', express.static(imageDir));

  let server = http.Server(app);
  let sio = socketIO(server);

  return {

    // start web server
    start: function() {
      server.listen(3000);

      sio.on('connection', socket => {
        socket.on('create', () => {
          worker.create()
              .subscribe(
                result => sio.sockets.emit('create', result),
                error => console.error('create error:', error));
        });
        socket.on('draw', data => {
          worker.draw(data)
              .subscribe(
                result => socket.broadcast.emit('draw', result),
                error => console.error('draw error:', error));
        });
      });

      Observable.interval(15000)
          .flatMap(worker.saveChanges)
          .subscribe(
            result => sio.sockets.emit('saved', result),
            error => console.error('save error:', error)
          );
    }

  };
}
