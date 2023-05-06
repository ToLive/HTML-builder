const fs = require('fs');
const path = require('path');

const dir = path.resolve(__dirname, 'secret-folder');

fs.readdir(dir, { withFileTypes: true }, (err, files) => {
  files.map((item) => {
    if (item.isFile()) {
      const filePath = path.resolve(dir, item.name);

      fs.stat(filePath, (error, stats) => {
        console.log(`${item.name} - ${path.extname(filePath).replace('.', '')} - ${(stats.size / 1024).toFixed(2)}kb`);
      });
    }
  });
});