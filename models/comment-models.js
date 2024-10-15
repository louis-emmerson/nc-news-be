const db = require("../db/connection")


function getCommentCountByID(article_id){
    return db.query(`SELECT COUNT(comment_id)
                     FROM comments
                     WHERE article_id = $1`,[article_id])
            .then((results)=>{
               return Number(results.rows[0].count)
            })
}

function fetchCommentsByArticleID(article_id){
    return db.query(`SELECT *
                     FROM comments
                     WHERE article_id = $1
                     ORDER BY created_at DESC`,[article_id])
            .then(({rows})=>{
               console.log(rows)
               return rows
            })
            .catch((err)=>{
                console.log(err)
            })
}

module.exports = {getCommentCountByID,fetchCommentsByArticleID}