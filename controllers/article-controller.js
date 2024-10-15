const { response } = require("../app")
const { fetchArticlesByID, fetchAllArticles, updateArticleByID } = require("../models/article-models")
const { getCommentCountByID } = require("../models/comment-models")

function getArticleByID(request, response, next){
    const {article_id} = request.params
    fetchArticlesByID(article_id)
    .then((articleObj)=>{
        response.status(200).send({article: articleObj})
    })
    .catch((err)=>{
        next(err)
    })

}

function getArticles(request, response, next){
    fetchAllArticles()
    .then((results)=>{
        return Promise.all(results.map((article)=>{
            return getCommentCountByID(article.article_id)
            .then((comment_count)=>{
                article.comment_count = comment_count
                return article
            })
       })
    )
    .then((articles)=>{
        response.status(200).send({articles:articles})
    })
  })
}

function patchArticle(request,response,next){
   const {article_id} = request.params
   updateArticleByID(article_id, request.body)
   .then(()=>{
    return fetchArticlesByID(article_id)
   })
   .then((result)=>{
    response.status(200).send({updatedArticle:result})
   })
   .catch((err)=>{
        next(err)
   })
}


module.exports = {getArticleByID, getArticles, patchArticle}