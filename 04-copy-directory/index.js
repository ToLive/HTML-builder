const fsPromises = require('node:fs/promises');
const path = require('path');

const app = async () => {
  try {
    const baseFolder = path.resolve(__dirname,'files');
    const projectFolder = path.resolve(__dirname,'files-copy');
    
    await fsPromises.mkdir(projectFolder, { recursive: true });
    
    const files = await fsPromises.readdir(baseFolder);

    for (const file of files) {
      const oldDestination = path.join(baseFolder, file);      
      const newDestination = path.join(projectFolder, file);

      await fsPromises.copyFile(oldDestination, newDestination);
    }
  } catch (err) {
    console.error(err.message);
  }
};

app();
