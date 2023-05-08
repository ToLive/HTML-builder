const fsPromises = require('node:fs/promises');
const path = require('path');

const app = async () => {
  try {
    const stylesFolder = path.resolve(__dirname, 'styles');
    const componentsFolder = path.resolve(__dirname, 'components');
    const projectFolder = path.resolve(__dirname, 'project-dist');
    const assetsFolder = path.resolve(__dirname, 'assets');

    const controller = new AbortController();
    const { signal } = controller;

    // check for project dist folder
    try {
      await fsPromises.readdir(projectFolder, { withFileTypes: true });
    } catch {
      await fsPromises.mkdir(projectFolder);
    }

    // read components
    const components = await fsPromises.readdir(componentsFolder, { withFileTypes: true });
    const componentsWithData = {};
        
    for (const item of components) {
      if (!item.isFile()) {
        return;
      }
      const { name: itemName } = item;

      const data = await fsPromises.readFile(path.join(componentsFolder, item.name), { encoding: 'utf8' });

      componentsWithData[itemName.split('.')[0]] = data;
    }

    // copy template to dist
  
    const oldDestination = path.resolve(__dirname, 'template.html');      
    const newDestination = path.resolve(projectFolder, 'index.html');

    await fsPromises.copyFile(oldDestination, newDestination);
    let templateData = await fsPromises.readFile(newDestination, { encoding: 'utf8' });
    
    // replace components

    Object.entries(componentsWithData).map(([key, value]) => {      
      templateData = templateData.replace(`{{${key}}}`, value);
    });

    await fsPromises.writeFile(newDestination, templateData, { signal });

    // merge styles
    const styleFiles = await fsPromises.readdir(stylesFolder, { withFileTypes: true });

    let res = [];

    for (const item of styleFiles) {
      if (item.isFile() && path.extname(item.name) === '.css') {
        const data = await fsPromises.readFile(path.join(stylesFolder, item.name), { encoding: 'utf8' });

        res.push(data);
      }
    }

    await fsPromises.writeFile(path.join(projectFolder, 'style.css'), res, { signal });

    // copy assets

    const projectAssetsDir = path.resolve(projectFolder, 'assets');
    await fsPromises.mkdir(projectAssetsDir, { recursive: true });
    
    console.log(projectAssetsDir);
    
    const copyFiles = async (source, dest) => {
      //const currObject = await fsPromises.stat(source);
      const files = await fsPromises.readdir(source, { withFileTypes: true });

      for (const item of files) {
        if (item.isFile()) {
          //console.log(source, )
          const oldDestination = path.join(source, item.name);      
          const newDestination = path.join(dest, item.name);

          await fsPromises.copyFile(oldDestination, newDestination);
          continue;
        }

        await fsPromises.mkdir(path.join(dest, item.name));
        copyFiles(path.join(source, item.name), path.join(dest, item.name));
      }
    };

    copyFiles(assetsFolder, projectAssetsDir);
  } catch (err) {
    console.error(err.message);
  }
};

app();