const {stdout}=process;
const path = require('path');
const fs = require('fs');

const readStream = fs.createReadStream(path.resolve(__dirname,'text.txt'));
readStream.on('data',(chunk) => {
  stdout.write(chunk);
});
readStream.on('end',()=>console.log("\n------------\n We done now"));
readStream.on('exit',()=>console.log("\n------------\n Exit output"));