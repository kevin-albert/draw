const fs = require('fs')
const PORT = process.env.PORT || 3000;
const STATIC_DIR = process.env.STATIC_DIR || '/tmp/draw';
if (!fs.existsSync(STATIC_DIR)) fs.mkdirSync(STATIC_DIR);

const worker = require('./worker').create(STATIC_DIR);
const io = require('./io').create(worker, PORT, STATIC_DIR);


io.start();
console.log('server started');


process.on('exit', exitHook);
process.on('SIGTERM', process.exit);
process.on('SIGINT', process.exit);

function exitHook() {
  console.log('cleaning up temporary files');
  if (fs.existsSync(STATIC_DIR)) {
    fs.readdirSync(STATIC_DIR).forEach(f => fs.unlinkSync(`${STATIC_DIR}/${f}`));
  }
  console.log('done');
  process.exit();
}
