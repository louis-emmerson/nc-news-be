const express = require("express")
const { postNewTopic, getAllTopics } = require("../controllers/topics-controller")
const router = express.Router()

router.get("/",getAllTopics)

router.post("/",postNewTopic)

module.exports = router