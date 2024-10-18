const db = require("../db/connection")


function fetchArticlesByID(article_id){
    return db.query(`SELECT articles.*, 
        COUNT(comments.comment_id)::INT AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;`,[article_id])
    .then((results)=>{
        const {rows, rowCount} = results
        if(rowCount === 0){
            return Promise.reject({status: 404,msg: "No article found with that id" })
        }
        return rows[0]
    })
}

function fetchAllArticles(order = "DESC", sort_by = "created_at", topic, p , limit=10){
    
    const allowedOrderQueries = ["DESC","ASC"]

    const allowedSortByQueries = ["title", "created_at", "topic", "author", "votes"]

    const allowedTopicQueries = ["mitch", "cats", "paper", undefined]

    let queryString = "SELECT author,title,article_id,topic,created_at,votes,article_img_url FROM articles"

    
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

    if(!allowedOrderQueries.includes(order) || !allowedSortByQueries.includes(sort_by)|| !allowedTopicQueries.includes(topic)){
        return Promise.reject({status: 400,msg: "Bad Request"})
    }else{
        if(topic !== undefined){
            queryString +=` WHERE topic = '${topic}'`
        }

        queryString+=` ORDER BY ${sort_by}`
        queryString+= ` ${order}`

        queryString += ` LIMIT ${limit}`

        if(p){
            queryString += ` OFFSET ${p*limit}`
        }


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

function addNewArticle(newArticleObj){
    const {title, topic, author, body, article_img_url=null } = newArticleObj
    const date = new Date() 

    let insertString = "INSERT INTO articles(title, topic, author, body, created_at, votes"
    let valuesString = "VALUES ($1, $2, $3, $4, $5, $6"

    const valueInserts = [title, topic, author, body, date, 0]
    if(!article_img_url){
        insertString += ")"
        valuesString += ")"

    }else{
        insertString += ", article_img_url)"
        valuesString += ", $7)"
        valueInserts.push(article_img_url)
    }
    
    let queryString = `${insertString} ${valuesString} RETURNING *`

    return db.query(queryString,valueInserts)
    .then((result)=>{
        return result.rows[0].article_id
    })
}
module.exports = {fetchArticlesByID, fetchAllArticles, updateArticleByID, addNewArticle}