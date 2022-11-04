const {
  stdout
} = process;
const path = require('path');
const fs = require('fs');
const fsProm = require('fs/promises');
const {stat} = require('fs');
const fileList =[];
let folder = path.resolve(__dirname, 'secret-folder');
console.log(folder, '!!!!!');
const getfileList = async (tagretFolder) => {
  fsProm.readdir(folder, {
      withFileTypes: true
    })
    .then((fileListObj) => {
      for (let file of fileListObj) {
        if (file.isDirectory() !== true) {
          let fileInfo;
          let size = stat(path.resolve(folder, file.name), (err,stats) => {
            if (err) {
              throw err;
            } else {
              let filename= path.parse(path.resolve(folder, file.name)).name;
              let size =stats.size;
              let ext = path.extname(path.resolve(folder, file.name));
              fileInfo=`${filename} - ${ext.slice(1)} - ${size/1000}kb`;
              console.log(fileInfo);
              fileList.push(fileInfo);
            }
          });
          
        }
      }
    })
    .catch(err => {
      console.error(err);
    });
};
getfileList(folder);
/* setTimeout(showFileList,10);
function showFileList () {
  console.log(fileList);
} */

