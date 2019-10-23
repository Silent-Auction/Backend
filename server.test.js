require('dotenv').config();
const request = require("supertest");
const server = require("./api/server.js");
const db = require("./data/dbconfig");

let token = ""
describe('testing auth endpoints', () => {
    db('users').del().where({username: "testtest"})
    it('returns an id', () => {
        return request(server).post('/api/auth/register').send({ username: "test2", password: "password", first_name: "jordan"})
            .then(res => {
                return expect(res.body).toBeTruthy();
            })
    })
    it('returns a token', () => {
        return request(server).post('/api/auth/login').send({ username: "testseller", password: "password" })
            .then(res => {
                token = res.body.token;
                return expect(res.body.token).toBeTruthy();
            })
    })
})
