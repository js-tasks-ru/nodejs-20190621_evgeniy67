const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

function _getFile(list, value) {
  return list.find((name) => path.parse(name).name === value);
}

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const dirPath = path.join(__dirname, 'files');

  switch (req.method) {
    case 'GET':
      if (!path.parse(pathname).dir) {
        const filesNames = fs.readdirSync(dirPath);
        const file = _getFile(filesNames, pathname);

        if (file) {
          const filepath = `${dirPath}/${file}`;
          const stream = fs.createReadStream(filepath);
          stream.pipe(res);
        } else {
          res.statusCode = 404;
          res.end('Not found');
        }
      } else {
        res.statusCode = 400;
        res.end('it is dirname');
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
