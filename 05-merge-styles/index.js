const path = require('path');
const fs = require('fs');
const fsProm = require('fs/promises');

async function getStylesArray(folder) {
  const filesArr = await getCssFilesArr(folder).then(res => res);
  console.log(filesArr, 'arr');
  const stylesArrProm = Promise.all(filesArr.map((elem) => {
    console.log(path.resolve(folder,elem));
    return fsProm.readFile(path.resolve(folder,elem),'utf-8');
  }));
  const stylesArr=await stylesArrProm.then(res=>res);
  const styleObjArr=[];
  for (let i=0;i<filesArr.length;i++) {
    //styleObjArr.push({[filesArr[i].slice(0,filesArr[i].length-4)]:stylesArr[i]});
    styleObjArr.push({[filesArr[i].slice(0,filesArr[i].lastIndexOf("."))]:stylesArr[i]});
  }
  return styleObjArr;
}
async function getCssFilesArr(folder) {
  const fileList = await fsProm.readdir(folder, {
    withFileTypes: true
  }).then(res => res);
  const fileArr = fileList.filter((file) => {
    return (file.isDirectory() === false) && (path.extname(path.resolve(folder, file.name)) === '.css');
  }).map((e) => e.name);
  return fileArr;
}
//getCssFilesArr (path.resolve(__dirname,'styles')).then(re=>console.log(re,'result'));
getStylesArray(path.resolve(__dirname, 'styles')).then(re => console.log(re, 'result'));






//getFileList (path.resolve(__dirname)).then(result=>console.log(result));
/* (async function () {
const r=await getFileList (path.resolve(__dirname));
console.log(r,'ddd');
})(); */
/* const r = getFileList(path.resolve(__dirname));
r.then(result => console.log(result)); */