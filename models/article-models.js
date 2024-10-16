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

function fetchAllArticles(order = "DESC", sort_by = "created_at", topic){    
    const allowedOrderQueries = ["DESC","ASC"]

    const allowedSortByQueries = ["title", "created_at", "topic", "author", "votes"]

    const allowedTopicQueries = ["mitch", "cats", "paper", undefined]

    // let queryString = "SELECT author,title,article_id,topic,created_at,votes,article_img_url FROM articles"
    let queryString = "SELECT author,title,article_id,topic,created_at,votes,article_img_url FROM articles"

    
    if(!allowedOrderQueries.includes(order) || !allowedSortByQueries.includes(sort_by)|| !allowedTopicQueries.includes(topic)){
        return Promise.reject({status: 400,msg: "Bad Request"})
    }else{
        if(topic !== undefined){
            queryString +=` WHERE topic = '${topic}'`
        }

        queryString+=` ORDER BY ${sort_by}`
        queryString+= ` ${order}`


        return db.query(queryString)
        .then(({rows})=>{
            return rows
        })
    }

}

function updateArticleByID(article_id,updateObject){
    return db.query(`UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2`,[updateObject.inc_votes,article_id])
}

module.exports = {fetchArticlesByID, fetchAllArticles, updateArticleByID}