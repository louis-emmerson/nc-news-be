const db = require("../db/connection")


function getCommentCountByID(article_id){
    return db.query(`SELECT COUNT(comment_id)
                     FROM comments
                     WHERE article_id = $1`,[article_id])
            .then((results)=>{
               return Number(results.rows[0].count)
            })
}

module.exports = {getCommentCountByID}