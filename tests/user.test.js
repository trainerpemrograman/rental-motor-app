const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const config = require('../config');

beforeAll(async () => {
    await mongoose.connect(config.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('User API', () => {
    it('should register a user', async () => {
        const res = await request(app)
            .post('/api/users/register')
            .send({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password123'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should login a user', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({
                email: 'testuser@example.com',
                password: 'password123'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });
});
