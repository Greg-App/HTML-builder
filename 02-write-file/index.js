const {
  stdin,
  stdout
} = process;
const path = require('path');
const fs = require('fs');
const readline = require('readline');

/* fs.open(path.resolve(__dirname,'newText.txt'),'w',(err)=>{
  if(err) {
    console.log("ERROR!!!");
  throw err;
  }
  stdout.write('The new file has created.\n');
  stdout.write('Please, type some text and then press "Enter" to append the text line to new file (type "exit" or press "Ctrl+c" to finish the process):\n');

}); */
const writeToFile = fs.createWriteStream(path.resolve(__dirname, 'newText.txt'));

/* 
stdin.on('data', chunk => output.write(chunk));
stdin.on('error', error => console.log('Error', error.message));
stdin.pipe(output); */

stdout.write('The new file has created.\n');
  stdout.write('Please, type some text and then press "Enter" to append the text line to new file (type "exit" or press "Ctrl+c" to finish the process):\n');
stdin.on('data', (data) => {
  if (data.toString().toLowerCase().trim() == 'exit') {
    console.log('File editing is done. Bye! (exit by exit command)');
    writeToFile.end();
    process.exit();
  } else {
    writeToFile.write(data, (err) => {
      if (err) {
        throw err;
      }
    });
  }
});
process.on('SIGINT', () => {
  console.log('File editing is done. Bye! (exit by pressing "Ctrl+c")');
  writeToFile.end();
  process.exit();
});

/* const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin, 
    output: writeToFile,
});



  rl.close(); */