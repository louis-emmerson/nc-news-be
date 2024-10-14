const express = require("express")
const app = express()
const {getAllTopics} = require("./controllers/topics-controller")
const getAllEndpoints = require("./controllers/endpoints-controller") 


app.get("/api", getAllEndpoints)

app.get("/api/topics", getAllTopics)


app.use((error,request,response,next)=>{
    res.status(500).send({msg: "unknown server error"})
})

app.use("/*", (request, response)=>{
    response.status(404).send({msg: "Route not found!"})
})



module.exports = app