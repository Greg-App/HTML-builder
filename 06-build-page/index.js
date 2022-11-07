const path = require('path');
const fs = require('fs');
const fsProm = require('fs/promises');


const tempHtml = fs.promises.readFile(path.resolve(__dirname, 'template.html'));

async function getFilesArr(folder, ext) {
  const fileList = await fsProm.readdir(folder, {
    withFileTypes: true
  }).then(res => res);
  const fileArr = fileList.filter((file) => {
    return (file.isDirectory() === false) && (path.extname(path.resolve(folder, file.name)) === `.${ext}`);
  }).map((e) => e.name);
  return fileArr;
}
async function getFileContentObjArray(folder, ext) {
  const filesArr = await getFilesArr(folder, ext).then(res => res);
  //console.log('File list to bundle:', filesArr);
  const stylesArrProm = Promise.all(filesArr.map((elem) => {
    return fsProm.readFile(path.resolve(folder, elem), 'utf-8');
  }));
  const stylesArr = await stylesArrProm.then(res => res);
  const styleObjArr = [];
  for (let i = 0; i < filesArr.length; i++) {
    styleObjArr.push({
      [filesArr[i].slice(0, filesArr[i].lastIndexOf("."))]: stylesArr[i]
    });
  }
  return styleObjArr;
}
async function appendFileContent(trgtFilePath, dataArr) {
  const fileContent = dataArr
    .map((elem) => Object.values(elem)[0])
    .join('\n');
  //console.log('\nNew bundle.css file:\n-------------------\n', fileContent);
  return fsProm.writeFile(trgtFilePath, fileContent);
}
/*-----Copy directory function---------START------*/
const copyFrom = path.resolve(__dirname, 'assets');
const copyTo = path.resolve(__dirname, 'project-dist', 'assets');

async function copyDir(sourceFolder, targetFolder) {
  return await new Promise(function (resolve, reject) {
    let updFlag = [false, 0, 0];
    fsProm.readdir(sourceFolder, {
        withFileTypes: true
      })
      .then((fileListObj) => {
        updFlag[0] = true;
        let fileList = [];
        for (let file of fileListObj) {
          if (file.isDirectory() !== true) {
            fileList.push(file.name);
          } else {
            copyDir(path.resolve(sourceFolder, file.name), path.resolve(targetFolder, file.name));
          }
        }
        fsProm.mkdir(targetFolder, {
            recursive: true
          })
          .then(() => {
            fsProm.readdir(targetFolder)
              .then((oldTargetList) => {
                for (let i = 0; i < fileList.length; i++) {
                  updFlag[2] += 1;
                  fsProm.copyFile(path.resolve(sourceFolder, fileList[i]), path.resolve(targetFolder, fileList[i]))
                    .then(() => {
                      console.log(`copy/update file complete from files to files-copy: ${fileList[i]}`);
                      updFlag[2] -= 1;
                      if (updFlag[1] === 0 && updFlag[2] === 0) {
                        console.log('\ncopy/update directory done');
                        resolve(true);
                      }
                    })
                    .catch(err => {
                      console.error(err);
                      reject(false);
                      throw err;
                    });
                }
              });
          })
          .catch(err => {
            console.error(err.message);
            console.log('AAAAAAAAA999999AAAAAAA');
            reject(false);
            throw err;
          });
      })
      .catch(err => {
        console.error(err.message);
        throw err;
      });
  });
}

/*-----Copy directory function---------END------*/

async function buildPage() {
  let tempHtml = await fs.promises.readFile(path.resolve(__dirname, 'template.html'), 'utf-8');
  //console.log(tempHtml);
  let compHtmlArr = await getFileContentObjArray(path.resolve(__dirname, 'components'), 'html');
  compHtmlArr = compHtmlArr.map((elem) => Object.entries(elem).flat());
  //console.log(compHtmlArr);
  for (const comp of compHtmlArr) {
    if (tempHtml.match(`{{${comp[0]}}}`)) {
      tempHtml = tempHtml.replace(`{{${comp[0]}}}`, `${comp[1]}`);
    }
  }
  await fsProm.mkdir(path.resolve(__dirname, 'project-dist'), {
    recursive: true
  });
  await fsProm.writeFile(path.resolve(__dirname, 'project-dist', 'index.html'), tempHtml);
  const styles = await getFileContentObjArray(path.resolve(__dirname, 'styles'), 'css');
  await appendFileContent(path.resolve(__dirname, 'project-dist', 'style.css'), styles);
  const del= new Promise (function (resolve,reject) {
    const date =new Date();
    console.log('start',date.getMilliseconds());
    fs.rm(path.resolve(__dirname,'project-dist','assets'),{recursive:true,force:true},()=>{
      const dat =new Date();
      console.log('end',dat.getMilliseconds());
      resolve();});  
  });
  await del;
   await copyDir(copyFrom, copyTo);
  
  //await copyDir(copyFrom, copyTo);
  return tempHtml;
}
buildPage().then(res=>console.log('\n---------------------------\nBuild page done'));
//.then(res=>console.log(res))

console.log(path.dirname('index.js'));