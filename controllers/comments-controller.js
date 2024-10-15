const { fetchArticlesByID } = require("../models/article-models")
const { fetchCommentsByArticleID, addNewComment } = require("../models/comment-models")

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
    addNewComment(request.body, request.params.article_id)
    .then(({rows})=>{
        response.status(201).send({comment:rows[0]})
    })
    .catch((err)=>{
        next(err)
    })
}

module.exports = {getCommentsByArticleID, postNewComment}