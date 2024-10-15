const { promises } = require("supertest/lib/test")
const { fetchArticlesByID } = require("../models/article-models")
const { fetchCommentsByArticleID, addNewComment } = require("../models/comment-models")
const { fetchUser } = require("../models/user-models")

function getCommentsByArticleID(request, response,next){
    const {article_id} = request.params
    const promises = [fetchCommentsByArticleID(article_id), fetchArticlesByID(article_id)]

    Promise.all(promises)
    .then((comments)=>{
        response.status(200).send({comments: comments[0]})
    })
    .catch((err)=>{
        next(err)
    })
}

function postNewComment(request,response,next){
    const promises =[fetchArticlesByID(request.params.article_id),fetchUser(request.body.username)]

    Promise.all(promises)
    .then(()=>{
        if(promises[1])
        return addNewComment(request.body, request.params.article_id)
    })
    .then(({rows})=>{
        response.status(201).send({comment:rows[0]})
    })
    .catch((err)=>{
        next(err)
    })
    
   
}

module.exports = {getCommentsByArticleID, postNewComment}