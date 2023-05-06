const fsPromises = require('node:fs/promises');
const path = require('path');

const app = async () => {
  try {
    const baseFolder = path.resolve(__dirname,'styles');
    const projectFolder = path.resolve(__dirname,'project-dist');

    const controller = new AbortController();
    const { signal } = controller;

    const files = await fsPromises.readdir(baseFolder, { withFileTypes: true });

    let res = [];

    for (const item of files) {
      if (item.isFile() && path.extname(item.name) === '.css') {
        const data = await fsPromises.readFile(path.join(baseFolder, item.name), { encoding: 'utf8' });

        res.push(data);
      }
    }

    await fsPromises.writeFile(path.join(projectFolder, 'bundle.css'), res, { signal });
  } catch (err) {
    console.error(err.message);
  }
};

app();