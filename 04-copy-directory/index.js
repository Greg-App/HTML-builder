const path = require('path');
const fs = require('fs');
const fsProm = require('fs/promises');

const sourceFolder = path.resolve(__dirname, 'files');
const targetFolder = path.resolve(__dirname, 'files-copy');
//fsProm.mkdir(targetFolder, {recursive:true});

fsProm.readdir(sourceFolder, {
    withFileTypes: true
  })
  .then((fileListObj) => {
    let fileList = [];
    for (let file of fileListObj) {
      if (file.isDirectory() !== true) {
        fileList.push(file.name);
      }
    }
    if (fileList.length > 0) {
      fsProm.mkdir(targetFolder, {
          recursive: true
        })
        .then(() => {
          for (let i = 0; i < fileList.length; i++) {
            fsProm.copyFile(path.resolve(sourceFolder,fileList[i]),path.resolve(targetFolder,fileList[i]))
            .then(()=>{
              console.log(`file ${i} copying complete`);
          });
          }
        })
        .catch(err => {
          console.error(err);
        });
    }
  })
  .catch(err => {
    console.error(err);
  });