const fs = require('fs');
const path = require('path');

const reader = fs.createReadStream(path.resolve(__dirname, 'text.txt'));

reader.on('error', function (error) {
  console.log('Error reading file: ', error.message);
});

reader.on('data', function (chunk) {
  console.log(chunk.toString());
});
