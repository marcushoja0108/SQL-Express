const app = require('../index.js');
const assert = require('assert')
const request = require('supertest')

describe('Get/users', () => {
    it('should return a list of users', async () => {
        const result = await request(app).get('/users')
        
        console.log(result.body)
        assert.ok(Array.isArray(result.body), "Expected result to be an array");
        if(result.body.length > 0){
            assert.ok(result.body[0].hasOwnProperty('ID'), "User should have ID");
            assert.ok(result.body[0].hasOwnProperty('Name'), "User should have Name");
            assert.ok(result.body[0].hasOwnProperty('Age'), "User should have Age");
            assert.ok(result.body[0].hasOwnProperty('Email'), "User should have Email");
        }
    });
});

describe('Get/users/:id', () => {
    it('should return a spesific user based on id', async () => {
        const userId = 1; //Exists in database
        const result = await request(app).get(`/users/${userId}`)

        console.log(result.body)
        if(result.body.length > 0){
            assert.ok(result.body[0].hasOwnProperty('ID'),"User should have ID");
            assert.ok(result.body[0].hasOwnProperty('Name'), "User should have Name");
            assert.ok(result.body[0].hasOwnProperty('Age'), "User should have Age");
            assert.ok(result.body[0].hasOwnProperty('Email'), "User should have Email");
        } else {
            console.log("this user might not exist")
        };
    });

    });
        it('should return an empty array if the user does not exist', async () => {
            const fakeId = 0; //Does not exist

            const result = await request(app).get(`/users/${fakeId}`);

            assert.ok(Array.isArray(result.body), "Expect an array in body");
            assert.strictEqual(result.body.length, 0, "Expects array length to be 0");
});

