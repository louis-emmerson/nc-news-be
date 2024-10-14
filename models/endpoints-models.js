const fs = require("node:fs/promises")

function getEndpointsFile(){
    return fs.readFile(`${__dirname}/../endpoints.json`,"utf-8")
    .then((fileData)=>{
        return JSON.parse(fileData)
    })
}

module.exports = getEndpointsFile