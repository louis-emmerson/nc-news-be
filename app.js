const express = require("express")
const app = express()
const {getAllTopics} = require("./controllers/topics-controller")
const {getAllEndpoints} = require("./controllers/endpoints-controller") 
const { getAllUsers } = require("./controllers/users-controller")
const articles = require("./articles")
const comments = require("./comments")


app.use(express.json())


app.get("/api", getAllEndpoints)

app.get("/api/topics", getAllTopics)

app.use("/api/articles", articles)

app.use("/api/comments", comments)

app.get("/api/users", getAllUsers)

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
    if(err.code === '22P02' || err.code === '23503'|| err.code === '23502'){
        response.status(400).send({msg: "Bad Request"})
    }else{
        next(err)
    }
})

app.use((error,request,response,next)=>{
    res.status(500).send({msg: "unknown server error"})
})





module.exports = app