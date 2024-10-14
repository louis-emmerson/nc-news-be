const db = require("../db/connection")

function fetchAllTopics(){
    return db.query(`SELECT * FROM topics`)
    .then((response)=>{
        return response.rows
    })
}


module.exports = {fetchAllTopics}