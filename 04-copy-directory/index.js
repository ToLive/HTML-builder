const fsPromises = require('node:fs/promises');
const path = require('path');

const app = async () => {
  try {
    const baseFolder = path.resolve(__dirname,'files');
    const projectFolder = path.resolve(__dirname,'files-copy');
    
    // check for project dist folder
    try {
      await fsPromises.rm(projectFolder, { force: true, recursive: true });
      await fsPromises.mkdir(projectFolder);
    } catch {
      await fsPromises.mkdir(projectFolder);
    }
    
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
