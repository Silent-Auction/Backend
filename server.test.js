require('dotenv').config();
const request = require("supertest");
const server = require("./api/server.js");
const db = require("./data/dbconfig");

let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoxLCJ1c2VybmFtZSI6InRlc3RzZWxsZXIiLCJzZWxsZXIiOjEsImlhdCI6MTU3MTg2Mzg2OCwiZXhwIjoxNTcyMTIzMDY4fQ.nU35QublVEs5T-sRLOFIi7JNyo0wrNHZv_IsiIb7Pfg"
describe('testing auth endpoints', () => {
    db('users').del().where({username: "testtest"})
    it('returns an id: register successful', () => {
        return request(server).post('/api/auth/register').send({ username: "test2", password: "password", first_name: "jordan"})
            .then(res => {
                return expect(res.body).toBeTruthy();
            })
    })
    it('returns a token: login successful', () => {
        return request(server).post('/api/auth/login').send({ username: "testseller", password: "password" })
            .then(res => {
                token = res.body.token;
                console.log(token);
                return expect(res.body.token).toBeTruthy();
            })
    })
})
describe('user endpoints', () => {
    it('returns status 200', () => {
        return request(server).get('/api/users').set({authorization: token})
            .then(res => expect(res.status).toBe(200))
    })
    it('gets username', () => {
        return request(server).get('/api/users').set({authorization: token})
            .then(res => expect(res.body.username).toBe('testseller'))
    })
    it('have more than one auction', () => {
        return request(server).get('/api/users').set({authorization: token})
            .then(res => expect(res.body.auctions.length).toBeGreaterThan(0))
    })
})
describe('auction endpoints', () => {
    it('get / returns status code 200', () => {
        return request(server).get('/api/auctions').set({authorization: token})
            .then(res => expect(res.status).toBe(200))
    })
    it('get / returns auctions with length > 0', () => {
        return request(server).get('/api/auctions').set({authorization: token})
            .then(res => {
                return expect(res.body.length).toBeTruthy()})
    })
    db('auctions').truncate()
    it('post / returns status code 201', () => {
        const auction = {
            "name": "computer",
            "date_starting": "10/29/19",
            "date_ending": "11/15/19",
            "starting_price": 200,
            "image":"https://i.imgur.com/6Pfl5W2.jpg"
        }
        return request(server).post('/api/auctions').set({authorization: token}).send(auction)
            .then(res => expect(res.status).toBe(201))
    })
    it('delete /:id returns status code 201', () => {
        return request(server).delete('/api/auctions/16').set({authorization: token})
            .then(res => expect(res.status).toBe(201))
    })
})