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
               return rows
            })
}

function addNewComment({username, body}, article_id){
   const date = new Date();
   
   return db.query(`INSERT INTO comments(votes, created_at, author, body, article_id) VALUES( $1, $2, $3, $4, $5)
      RETURNING *`,[0, date, username, body, Number(article_id)])
   .then((result)=>{
      return result
   })
}

module.exports = {getCommentCountByID,fetchCommentsByArticleID, addNewComment}