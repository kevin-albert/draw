const fs = require('fs')
const PORT = process.env.PORT || 3000;
const STATIC_DIR = process.env.STATIC_DIR || '/tmp/draw';
fs.mkdirSync(STATIC_DIR);

const worker = require('./worker').create(STATIC_DIR);
const io = require('./io').create(worker, PORT, STATIC_DIR);

io.start();

console.log('server started');