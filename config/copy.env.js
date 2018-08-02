'use strict'
const path = require('path');
const basePath = path.resolve(__dirname, '../../stu/index.html');
const toPath = path.resolve(__dirname, '../../stu/');
let routerPath = [
    toPath+'/tzy/yxfirst/',
    toPath+'/tzy/zyfirst/'
]
let copyPath = [];
routerPath.forEach((item) => {
    copyPath.push({ from: basePath, to: item })
});
console.log(copyPath)
module.exports = {
    NODE_ENV: '"copy"',
    copyPath: copyPath
}