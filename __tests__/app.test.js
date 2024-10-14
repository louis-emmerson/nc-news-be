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