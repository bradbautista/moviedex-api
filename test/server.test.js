const supertest = require('supertest');
const server = require('../server');
const { expect } = require('chai');
const apiToken = process.env.API_TOKEN

describe('GET /movie', () => {

    // Does the user get bounced without a token?
    it('should bounce the user without proper authorization', () => {
        return supertest(server)
            .get('/movie')
            .expect(401)
    });

    // Does the user receive an array back?
    it('should return an array of movies', () => {
        return supertest(server)
            .get('/movie')
            .set('Authorization', 'Bearer ' + apiToken)
            .expect(200)
            .expect('Content-type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
            })
    });

})