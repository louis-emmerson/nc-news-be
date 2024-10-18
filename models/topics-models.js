const db = require("../db/connection")

function fetchAllTopics(){
    return db.query(`SELECT * FROM topics`)
    .then((response)=>{
        return response.rows
    })
}

function addNewTopic(newTopic){
    return db.query(`INSERT INTO topics (slug, description)
                     VALUES ($1, $2)
                     RETURNING *`,[newTopic.slug,newTopic.description])
    .then((response)=>{
        return response.rows[0]
    })
}


module.exports = {fetchAllTopics,addNewTopic}