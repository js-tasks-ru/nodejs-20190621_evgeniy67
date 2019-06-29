const fs = require('fs');

function deleteFile(req, res, filepath) {
  if (!fs.existsSync(filepath)) {
    res.statusCode = 404;
    res.end('A file with the same name don\'t exists');
    return;
  }

  fs.unlink(filepath, (err) => {
    if (err) {
      throw err;
    }

    res.statusCode = 200;
    res.end('File successfully delete');
  });
}

module.exports = deleteFile;
