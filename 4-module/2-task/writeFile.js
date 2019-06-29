const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const MB = 1048576; // bait

function cleanUp(filepath, streams = []) {
  fs.unlink(filepath, (err) => {
    if (err && err.code === 'ENOENT') {
      // file don't exists
    } else if (err) {
      throw err;
    }
  });

  streams.forEach((stream) => stream.destroy());
}

function writeFile(req, res, filepath) {
  if (fs.existsSync(filepath)) {
    res.statusCode = 409;
    res.end('A file with the same name already exists');
    return;
  }

  const writeStream = fs.createWriteStream(filepath);
  const streamLimit = new LimitSizeStream({limit: MB});

  req.pipe(streamLimit).pipe(writeStream);

  req.on('aborted', () => {
    cleanUp(filepath, [writeStream, streamLimit]);
    res.statusCode = 500;
    res.end('Aborted connect');
  });

  streamLimit.on('error', (err) => {
    cleanUp(filepath, [writeStream, streamLimit]);
    res.statusCode = 413;
    res.end('Size file don\'t should exceed one MB');
  });

  writeStream.on('error', (err) => {
    cleanUp(filepath);
    res.statusCode = 500;
    res.end('File didn\'t write');
  }).on('finish', () => {
    res.statusCode = 201;
    res.end('File successfully written');
  });
}

module.exports = writeFile;
