const express = require('express')
const { getArticles, getArticleByID, patchArticle, postNewArticle} = require('./controllers/article-controller')
const { getCommentsByArticleID, postNewComment } = require('./controllers/comments-controller')
const router = express.Router()

router.get("/", getArticles)

router.get("/:article_id", getArticleByID)

router.get("/:article_id/comments", getCommentsByArticleID)

router.post("/:article_id/comments", postNewComment)

router.patch("/:article_id", patchArticle)

router.post("/",postNewArticle)


module.exports = router