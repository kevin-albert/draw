const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const storage = require('./storage');

module.exports.create = create;

function create(worker, port, imageDir) {
  let app = express()
    .set('title', 'DRAW')
    .set('json spaces', 2)
    .set('x-powered-by', false)
    .set('strict routing', true)
    .use(bodyParser.json())
    .get('/', (req, res) => res.end('ok'))
    .get('/init', (req, res) => res.json(worker.init()))
    .use('/img', express.static(imageDir));

  let sio = socketIO(http.Server(app));

  return {

    // start web server
    start: function() {
      app.listen(3000);
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

      worker.snapshot.subscribe(data => sio.sockets.emit('snapshot', data));
    }
  };
}
