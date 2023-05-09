const fs = require('fs');
const fsPromises = require('node:fs/promises');
const path = require('path');
const readline = require('node:readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const app = async () => {
  const destFile = path.resolve(__dirname, 'text.txt');

  try {
    await fsPromises.rm(destFile, { force: true, recursive: true });
  } catch {
    console.log('Error on delete file');
  }

  const writer = fs.createWriteStream(destFile, { flags: 'a' });

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
}

app();