const db = require("../db/connection")


function getCommentCountByID(article_id){
    return db.query(`SELECT COUNT(comment_id)
                     FROM comments
                     WHERE article_id = $1`,[article_id])
            .then((results)=>{
               return Number(results.rows[0].count)
            })
}

function fetchCommentsByArticleID(article_id, limit=10, p){

   if(p){
      if(isNaN(p)){
          return Promise.reject({status: 400,msg: "Bad Request"})
      }
  }

  if(limit){
      if(isNaN(limit)){
          return Promise.reject({status: 400,msg: "Bad Request"})
      }
  }

  let queryString =`SELECT *
                     FROM comments
                     WHERE article_id = $1
                     ORDER BY created_at DESC`

  queryString += ` LIMIT ${limit}`

  if(p){
     queryString += ` OFFSET ${p*limit}`
  }

   return db.query(queryString,[article_id])
            .then(({rows})=>{
               return rows
            })
}

function addNewComment({username, body}, article_id){
   if(!username || !body){
      return Promise.reject({status:400,msg:"Wrong Comment Body"})
   }
   const date = new Date()
   
   return db.query(`INSERT INTO comments(votes, created_at, author, body, article_id) VALUES( $1, $2, $3, $4, $5)
      RETURNING *`,[0, date, username, body, Number(article_id)])
   .then((result)=>{
      return result
   })
}

function getCommentByID(comment_id){
   return db.query(`SELECT * FROM comments
      WHERE comment_id = $1;`,[comment_id])
      .then(({rows})=>{
         if(rows.length === 0){
            return Promise.reject({status: 404, msg: "Comment not found"})
         }else{
            return rows[0]
         }
      })
}

function deleteCommentByID(comment_id){
   return db.query(`DELETE FROM comments
                    WHERE comment_id = $1;`,[comment_id])
      .then((result)=>{
         if(result.rowCount === 0){
            return Promise.reject({status: 400, msg: "Bad Request"})
         }
         return result.rows[0]
      })
}

function updateCommentByID(comment_id, votes){
   return db.query(`UPDATE comments
                    SET votes = votes + $2
                    WHERE comment_id = $1`,[comment_id, votes])
         .then((results)=>{
            if(results.rowCount === 0) return Promise.reject({status:404,msg:"No comment found to update"})
            return getCommentByID(comment_id)
         })

}

module.exports = {getCommentCountByID,fetchCommentsByArticleID, addNewComment,deleteCommentByID, getCommentByID,updateCommentByID}