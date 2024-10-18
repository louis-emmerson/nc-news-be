const { fetchAllTopics, addNewTopic } = require("../models/topics-models")

function getAllTopics(request,response){
    fetchAllTopics()
    .then((topics)=>{
        response.status(200).send({topics:topics})
    })  
}

function postNewTopic(request, response, next){
    const newTopic = request.body
    addNewTopic(newTopic)
    .then((newTopic)=>{
        response.status(201).send({newTopic})
    })
    .catch((err)=>{
        next(err)
    })

}

module.exports = {getAllTopics, postNewTopic}