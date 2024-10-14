const express = require("express")
const app = express()
const {getAllTopics} = require("./controllers/topics-controller")


app.get("/api/topics",getAllTopics)



app.use("/*", (request, response)=>{
    response.status(404).send({msg: "Route not found!"})
})

module.exports = app