const app = require('../index.js');
const assert = require('assert')
const request = require('supertest')

//tester få alle brukere endepunktet
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

//tester get user based on id endepunktet
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

//tester legg til bruker endepunktet
describe('Post/users', async () => {
    it('should post a new User into Users', async () => {
        const newUser = {Name: "George", Age: 35, Email: "George@mail.com"};
        

        const result = await request(app).post('/users').send(newUser).expect(201)

        assert.strictEqual(typeof result.body, "object", "Expect response to be an object");
        assert.strictEqual(result.body.Name, newUser.Name, "Names should match");
        assert.strictEqual(result.body.Age, newUser.Age, "Ages should match");
        assert.strictEqual(result.body.Email, newUser.Email, "Emails should match");
    });
    it('should return 400 for missing fields', async () => {
        const incompleteUser = {Name: "Bill", Age: 80};

        const result = await request(app).post('/users').send(incompleteUser).expect(400);

        assert.strictEqual(result.body.error, "Missing required fields", "Error message should be 400"); //Gjentar her error som jeg forventer
    });
});

//tester edit endepunktet
describe('Put/users/:id', async () => {
    it('should update a specific user based on their id', async () => {
        const updatedUserId = 5;
        const updatedUser = {Name: "George", Age: 38, Email: "GeorgeJ@banking.com"};

        const result = await request(app).put(`/users/${updatedUserId}`).send(updatedUser);

        assert.strictEqual(typeof result.body, "object", "Expect response to be an object");
        assert.strictEqual(result.body.Name, updatedUser.Name, "Names should match");
        assert.strictEqual(result.body.Age, updatedUser.Age, "Ages should match");
        assert.strictEqual(result.body.Email, updatedUser.Email, "Emails should match");
    });
});

//tester delete endepunktet
describe('Delete/users/:id', async () => {
    it('should delete a specific user based on their id', async () => {
        const deleteUserId = 20;

        const result = await request(app).delete(`/users/${deleteUserId}`).expect(200);

        assert.strictEqual(result.body.message, `User with id: ${deleteUserId} has been deleted`, "Message to confirm deletion of correct user");  
    });
    it('should return 404 when the user does not exist', async () => {
        const nonExistentuserId = 0;

        const result = await request(app).delete(`/users/${nonExistentuserId}`).expect(404);
        assert.strictEqual(result.body.error, "User not found", "Error message should match")
    });
    it('should return 400 for invalid user ID, string instead of number', async () => {
        const result = await request(app).delete('/users/InvalidID').expect(400)
        assert.strictEqual(result.body.error, "Invalid user ID", "Error message should match")
    });
});