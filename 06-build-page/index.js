const path = require('path');
const fs = require('fs');
const fsProm = require('fs/promises');

let copyMod=require('../04-copy-directory/index');
const copyFrom = path.resolve(__dirname, 'assets');
const copyTo = path.resolve(__dirname, 'files-copy');
copyMod.copyDir(copyFrom,copyTo);