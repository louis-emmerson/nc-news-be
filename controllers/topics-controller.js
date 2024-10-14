const { fetchAllTopics } = require("../models/topics-models")

function getAllTopics(request,response){
    fetchAllTopics()
    .then((topics)=>{
        response.status(200).send({topics:topics})
    })  
}


module.exports = {getAllTopics}