const { fetchArticlesByID } = require("../models/article-models")
const { fetchCommentsByArticleID, addNewComment, deleteCommentByID, getCommentByID, getCommentCountByID, updateCommentByID } = require("../models/comment-models")
const { fetchUser } = require("../models/user-models")

function getCommentsByArticleID(request, response,next){
    const {article_id} = request.params
    const {limit, p} = request.query
    const promises = [fetchCommentsByArticleID(article_id, limit, p), fetchArticlesByID(article_id)]

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

function getComment(request, response, next){
    const comment_id = request.params.comment_id
    getCommentByID(comment_id)
    .then((results)=>{
        response.status(200).send({comment: results})
    })
    .catch((err)=>{
        next(err)
    })
}

function deleteComment(request,response, next){
    const comment_id = request.params.comment_id
    getCommentCountByID(comment_id)
    .then(()=>{
        return deleteCommentByID(comment_id)
    })
    .then(()=>{
        response.status(204).send()
    })
    .catch((err)=>{
        next(err)
    })
}

function updateComment(request,response, next){
    updateCommentByID(request.params.comment_id,request.body.inc_votes)
    .then((updatedComment)=>{
        response.status(200).send({updatedComment})
    })
    .catch((err)=>{
        next(err)
    })
}

module.exports = {getCommentsByArticleID, postNewComment, deleteComment, getComment ,updateComment}