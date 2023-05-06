const fs = require('fs');
const path = require('path');
const readline = require('node:readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const writer = fs.createWriteStream(path.resolve(__dirname, 'text.txt'), { flags: 'a' });

writer.on('ready', () => {
  console.log('Hello! Write something\n');

  rl.on('line', (line) => {
    if (line === 'exit') {
      writer.close();

      rl.close();

      return;
    }
    writer.write(`${line}\n`);
  });

  rl.on('close', () => {
    console.log('Thank you! Bye');
  });
});