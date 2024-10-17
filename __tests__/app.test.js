const request = require("supertest")
const app = require("../app")
const db = require("../db/connection")
const data = require("../db/data/test-data")
const seed = require("../db/seeds/seed")
const articles = require("../db/data/test-data/articles")


beforeEach(()=>{
    return seed(data)
})

afterAll(()=>{
   return db.end()
})

describe("GET route that doesnt exist",()=>{
    it("should respond with a 404 error",()=>{
        return request(app)
        .get("/this-route-will-never-exist")
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe("Route not found!")
        })
    })
})

describe("GET /api/topics",()=>{
    it("responds with an array of topic objects",()=>{
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({body})=>{
            body.topics.forEach(topic => {
                expect(typeof topic.slug).toBe("string")
                expect(typeof topic.description).toBe("string")
            });
        })
    })
})

describe("GET /api",()=>{
    it("should return a json with the endpoints available",()=>{
        return request(app)
        .get("/api")
        .expect(200)
        .then(({body})=>{
            expect(typeof body.endpoints).toBe("object")
            expect(typeof body.endpoints["GET /api"]).toBe("object")
            expect(typeof body.endpoints["GET /api"].description).toBe("string")
        })
    })
})

describe("GET /api/articles/:article_id",()=>{
    it("should return an object article with the ID passed",()=>{
        return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({body})=>{
            expect(typeof body.article).toBe("object")
            expect(typeof body.article.author).toBe("string")
            expect(typeof body.article.title).toBe("string")
            expect(typeof body.article.article_id).toBe("number")
            expect(typeof body.article.body).toBe("string")
            expect(typeof body.article.topic).toBe("string")
            expect(typeof body.article.created_at).toBe("string")
            expect(typeof body.article.votes).toBe("number")
            expect(typeof body.article.article_img_url).toBe("string")
        })
    })
    it("returns error when invaild id format is used",()=>{
        return request(app)
        .get("/api/articles/this-is-not-a-valid-id")
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe("Bad Request")
        })
    })
    it("returns error when there is no article with that id",()=>{return request(app)
        .get("/api/articles/9999999")
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe("No article found with that id")
        })})
    })
    describe("Article response should also now include a comment count",()=>{
        it("should return an article with a comment_count",()=>{
            return request(app)
            .get("/api/articles/8")
            .expect(200)
            .then(({body})=>{
                expect(typeof body.article.comment_count).toBe("number")
                expect(body.article.comment_count).toBe(0)
            })
        
    })
})


describe("GET /api/articles",()=>{
    it("responds with an array of article objects",()=>{
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({body})=>{
            expect(Array.isArray(body.articles)).toBe(true)
            expect(body.articles.length).not.toBe(0)
            body.articles.forEach(article => {
                expect(typeof article.author).toBe("string")
                expect(typeof article.title).toBe("string")
                expect(typeof article.article_id).toBe("number")
                expect(typeof article.topic).toBe("string")
                expect(typeof article.created_at).toBe("string")
                expect(typeof article.votes).toBe("number")
                expect(typeof article.article_img_url).toBe("string")
                expect(typeof article.comment_count).toBe("number")
                expect(article.body).toBe(undefined)
            });
            expect(body.articles).toEqual(expect.arrayContaining([{
                author: 'icellusedkars',
                title: 'Eight pug gifs that remind me of mitch',
                article_id: 3,
                topic: 'mitch',
                created_at: '2020-11-03T09:12:00.000Z',
                votes: 0,
                article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                comment_count: 2
              }]))
    


        })
        
    })
    it("Should return the articles in sorted in descending order based on the date they were created",()=>{
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({body})=>{
            expect(body.articles).toBeSortedBy("created_at", {descending: true})
        })
    })
    describe("Articles order by query tests",()=>{
        it("Should return the articles in the descending order specified by the order query",()=>{
            return request(app)
            .get("/api/articles?order=DESC")
            .expect(200)
            .then(({body})=>{
                expect(body.articles).toBeSortedBy("created_at", {descending: true})
            })
        })
        it("Should return the articles in ascending order specified by the order query",()=>{
            return request(app)
            .get("/api/articles?order=ASC")
            .expect(200)
            .then(({body})=>{
                expect(body.articles).toBeSortedBy("created_at")
            })
        })

        it("Should return 400 bad request if passed an invalid order query",()=>{
            return request(app)
            .get("/api/articles?order=NOTASORTQUERY")
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("Bad Request")
            })
        })
    })
    describe("Articles sort by query tests",()=>{
        it("Should return the articles sorted by the query (title) ",()=>{
            return request(app)
            .get("/api/articles?sort_by=title")
            .expect(200)
            .then(({body})=>{
                expect(body.articles).toBeSortedBy("title", {descending: true})
            })
        })
        it("Should return the articles sorted by the query (topic) ",()=>{
            return request(app)
            .get("/api/articles?sort_by=topic")
            .expect(200)
            .then(({body})=>{
                expect(body.articles).toBeSortedBy("topic", {descending: true})
            })
        })
        it("Should return the articles sorted by the query (author) ",()=>{
            return request(app)
            .get("/api/articles?sort_by=author")
            .expect(200)
            .then(({body})=>{
                expect(body.articles).toBeSortedBy("author", {descending: true})
            })
        })
        it("Should return the articles sorted by the query (created_at) ",()=>{
            return request(app)
            .get("/api/articles?sort_by=created_at")
            .expect(200)
            .then(({body})=>{
                expect(body.articles).toBeSortedBy("created_at", {descending: true})
            })
        })
        it("Should return the articles sorted by the query (votes) ",()=>{
            return request(app)
            .get("/api/articles?sort_by=votes")
            .expect(200)
            .then(({body})=>{
                expect(body.articles).toBeSortedBy("votes", {descending: true})
            })
        })
    })
    describe("Articles topic query tests",()=>{
        it("Should return the articles that have the topic (mitch)",()=>{
            return request(app)
            .get("/api/articles?topic=mitch")
            .expect(200)
            .then(({body})=>{
                body.articles.forEach(article => {
                    expect(article.topic).toBe("mitch")
                });
            })
        })

        it("Should return the articles that have the topic (cats)",()=>{
            return request(app)
            .get("/api/articles?topic=cats")
            .expect(200)
            .then(({body})=>{
                body.articles.forEach(article => {
                    expect(article.topic).toBe("cats")
                });
            })
        })
        it("Should return the articles that have the topic (paper)",()=>{
            return request(app)
            .get("/api/articles?topic=paper")
            .expect(200)
            .then(({body})=>{
                body.articles.forEach(article => {
                    expect(article.topic).toBe("paper")
                });
            })
        })
        it("Should return 400 bad request when given an invalid topic (NotAVailidTopic)",()=>{
            return request(app)
            .get("/api/articles?topic=NotAVailidTopic")
            .expect(400)
            .then(({body})=>{
                    expect(body.msg).toBe("Bad Request")
            })
        })
    
    })
        
    }
    
)

describe("GET /api/articles/:article_id/comments",()=>{
    it("should respond with an array of comment objects with the matching article id",()=>{
        return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({body})=>{
            expect(body.comments.length).not.toBe(0)
            body.comments.forEach((comment)=>{
                expect(typeof comment.comment_id).toBe("number")
                expect(typeof comment.votes).toBe("number")
                expect(typeof comment.created_at).toBe("string")
                expect(typeof comment.author).toBe("string")
                expect(typeof comment.body).toBe("string")
                expect(typeof comment.article_id).toBe("number")
            })

            expect(body.comments).toEqual(expect.arrayContaining([{
                comment_id: 2,
                body: 'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
                votes: 14,
                author: 'butter_bridge',
                article_id: 1,
                created_at: '2020-10-31T03:03:00.000Z'
              }]))
        })
    })
    it("should return the most recent comments first in DESC order",()=>{
        return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({body})=>{
            expect(body.comments).toBeSortedBy("created_at", {descending: true})
            
    })
    })
    it("should return a 400 error when given an invalid article id format", ()=>{
        return request(app)
        .get("/api/articles/NOT-A-VALID-ID/comments")
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe("Bad Request")
            
    })
    })
    it("should return a 404 article not found when given an invalid article id", ()=>{
        return request(app)
        .get("/api/articles/99999/comments")
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe("No article found with that id")
    })
    })
})

describe("POST /api/articles/:article_id/comments",()=>{
    it("should respond with 201 and the newly created comment object",()=>{
        return request(app)
        .post("/api/articles/1/comments")
        .send({
            username: "lurker",
            body:"Wow this test adds a new comment!"
        })
        .expect(201)
        .then(({body})=>{
            const {comment} = body
            expect(typeof comment.comment_id).toBe("number")
            expect(typeof comment.votes).toBe("number")
            expect(typeof comment.created_at).toBe("string")
            expect(typeof comment.author).toBe("string")
            expect(typeof comment.body).toBe("string")
            expect(typeof comment.article_id).toBe("number")

            expect(body.comment.votes).toBe(0)
            expect(body.comment.author).toBe("lurker")
            expect(body.comment.body).toBe("Wow this test adds a new comment!")
            expect(body.comment.article_id).toBe(1)
        })
        
    })
    it("should respond with a 404 if the username is not found",()=>{
        return request(app)
        .post("/api/articles/1/comments")
        .send({
            username: "louis",
            body:"Wow this test adds a new comment!"
        })
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe("User not found")
        })
    })
    it("should respond with a 404 if the article is not found",()=>{
        return request(app)
        .post("/api/articles/99999/comments")
        .send({
            username: "lurker",
            body:"Wow this test adds a new comment!"
        })
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe("No article found with that id")
        })
    })
    it("should respond with a 404 if the send comment doesnt have the correct properties",()=>{
        return request(app)
        .post("/api/articles/1/comments")
        .send({
            NotACorrectUsername: "lurker",
            NotACorrectBody:"Wow this test adds a new comment!"
        })
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe("User not found")
        })
    })
})

describe("PATCH /api/articles/:article_id",()=>{
    it("Should update an article and return the updated article",()=>{
        return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes : 1000 })
        .expect(200)
        .then(({body})=>{
            expect(typeof body.updatedArticle).toBe("object")
            expect(typeof body.updatedArticle.author).toBe("string")
            expect(typeof body.updatedArticle.title).toBe("string")
            expect(typeof body.updatedArticle.article_id).toBe("number")
            expect(typeof body.updatedArticle.body).toBe("string")
            expect(typeof body.updatedArticle.topic).toBe("string")
            expect(typeof body.updatedArticle.created_at).toBe("string")
            expect(typeof body.updatedArticle.votes).toBe("number")
            expect(typeof body.updatedArticle.article_img_url).toBe("string")

            expect(body.updatedArticle.article_id).toBe(1)
            expect(body.updatedArticle.title).toBe("Living in the shadow of a great man")
            expect(body.updatedArticle.topic).toBe("mitch")
            expect(body.updatedArticle.author).toBe("butter_bridge")
            expect(body.updatedArticle.created_at).toBe("2020-07-09T20:11:00.000Z")
            expect(body.updatedArticle.votes).toBe(1100)
            expect(body.updatedArticle.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700")
        })
        

    })
    it("should minus votes if given a negative number",()=>{
        return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes : -1000 })
        .expect(200)
        .then(({body})=>{
            expect(body.updatedArticle.votes).toBe(-900)
        })
    })
    it("should return a 400 error when given an invalid article id format", ()=>{
        return request(app)
        .patch("/api/articles/NOT-A-VALID-ID")
        .send({ inc_votes : 1000 })
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe("Bad Request")
        })   
    })
    it("should return a 404 error when given an article id that does not exist",()=>{
        return request(app)
        .patch("/api/articles/9999")
        .send({ inc_votes : 1000 })
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe("No article found with that id")
        })   
    })
    it("should return a 400 error when given an update object with invalid properties",()=>{
        return request(app)
        .patch("/api/articles/1")
        .send({ not_the_correct_key : 1000 })
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe("Bad Request")
        }) 
    })
})

describe("GET /api/comments/:comment_id",()=>{
    it("should return a 200 and the comment in the response",()=>{
        return request(app)
        .get("/api/comments/1")
        .expect(200)
        .then(({body})=>{
            expect(body.comment.length).not.toBe(0)
            const comment = body.comment
            expect(typeof comment.comment_id).toBe("number")
            expect(typeof comment.votes).toBe("number")
            expect(typeof comment.created_at).toBe("string")
            expect(typeof comment.author).toBe("string")
            expect(typeof comment.body).toBe("string")
            expect(typeof comment.article_id).toBe("number")
        })
    })
    it("should return a 500 error and bad request if passed a none valid id",()=>{
        return request(app)
        .get("/api/comments/not-a-valid-id")
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe("Bad Request")
        })
    })
    it("should return a 404 error and not found if there is no comment with that id",()=>{
        return request(app)
        .get("/api/comments/99999")
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe("Comment not found")
        })
    })

    

})

describe("DELETE /api/comments/:comment_id",()=>{
    it("should return a 204 and delete the specified comment",()=>{
        return request(app)
        .delete("/api/comments/1")
        .expect(204)
    })
    it("should return a 400 error and bad request if passed a none valid id",()=>{
        return request(app)
        .delete("/api/comments/not-a-valid-id")
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe("Bad Request")
        })
    })
    it("should return a 500 error and not found if passed a a vaild id that doesnt exist",()=>{
        return request(app)
            .delete("/api/comments/100")
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("Bad Request")
            })
    })
})

describe("GET /api/users", ()=>{
    it("Should return 200 and an array of all users",()=>{
        return request(app)
        .get("/api/users")
        .expect(200)
        .then(({body})=>{
            expect(Array.isArray(body.users)).toBe(true)
            expect(body.users.length).not.toBe(0)
            body.users.forEach((user)=>{
                expect(typeof user.username).toBe("string")
                expect(typeof user.name).toBe("string")
                expect(typeof user.avatar_url).toBe("string")
            })

            expect(body.users[0].username).toBe('butter_bridge')
            expect(body.users[0].name).toBe('jonny')
            expect(body.users[0].avatar_url).toBe('https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg')

        })
    })
})

