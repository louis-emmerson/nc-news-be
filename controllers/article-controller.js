const { fetchArticlesByID } = require("../models/article-models")

function getArticleByID(request, response,next){
    const {article_id} = request.params
    fetchArticlesByID(article_id)
    .then((articleObj)=>{
        response.status(200).send({article: articleObj})
    })
    .catch((err)=>{
        console.log(err)
        next(err)
    })

}



module.exports = {getArticleByID}