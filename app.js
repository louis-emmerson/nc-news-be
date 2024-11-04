const express = require("express")
const app = express()
const {getAllEndpoints} = require("./controllers/endpoints-controller") 
const articles = require("./routers/articles")
const comments = require("./routers/comments")
const users = require("./routers/users")
const topics = require("./routers/topics")
const cors = require('cors');

app.use(cors());


app.use(express.json())


app.get("/api", getAllEndpoints)

app.use("/api/topics", topics)

app.use("/api/articles", articles)

app.use("/api/comments", comments)

app.use("/api/users", users)


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
    if(err.code === '22P02' || err.code === '23503'|| err.code === '23502' || err.code === '23505'){
        response.status(400).send({msg: "Bad Request"})
    }else{
        next(err)
    }
})

app.use((error,request,response,next)=>{
    res.status(500).send({msg: "unknown server error"})
})





module.exports = app