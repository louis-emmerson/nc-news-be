const express = require("express")
const app = express()
const {getAllTopics} = require("./controllers/topics-controller")
const {getAllEndpoints} = require("./controllers/endpoints-controller") 
const { getArticleByID, getArticles } = require("./controllers/article-controller")
const { getCommentsByArticleID } = require("./controllers/comments-controller")





app.get("/api", getAllEndpoints)

app.get("/api/topics", getAllTopics)

app.get("/api/articles",getArticles)

app.get("/api/articles/:article_id",getArticleByID)

app.get("/api/articles/:article_id/comments", getCommentsByArticleID)

app.all("/*", (request, response)=>{
    response.status(404).send({msg: "Route not found!"})
})

app.use((err, req, res, next)=>{
    if(err.status){
    res.status(err.status).send({msg: err.msg})
    }else{
    next(err)
    }
})

app.use((err, request, response, next)=>{
    if(err.code === '22P02'){
        response.status(400).send({msg: "Bad Request"})
    }else{
        next(err)
    }
})

app.use((error,request,response,next)=>{
    res.status(500).send({msg: "unknown server error"})
})





module.exports = app