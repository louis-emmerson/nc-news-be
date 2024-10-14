const getEndpointsFile = require("../models/endpoints-models")

function getAllEndpoints(request,response,next){
    getEndpointsFile()
    .then((fileContents)=>{
        response.status(200).send({endpoints: fileContents})
    })
    .catch((err)=>{
        next(err)
    })
}

module.exports = {getAllEndpoints}