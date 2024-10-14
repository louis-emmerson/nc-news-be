const db = require("../db/connection")


function fetchArticlesByID(article_id){
    return db.query(`SELECT * FROM articles
                     WHERE article_id = $1`,[article_id])
    .then((results)=>{
        const {rows, rowCount} = results
        if(rowCount === 0){
            return Promise.reject({status: 404,msg: "No article found with that id" })
        }
        return rows[0]
    })
}

module.exports = {fetchArticlesByID}