const request = require("supertest")
const app = require("../app")
const db = require("../db/connection")
const data = require("../db/data/test-data")
const seed = require("../db/seeds/seed")


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