const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Motor = require('../models/Motor');
const config = require('../config');

let token;

beforeAll(async () => {
    await mongoose.connect(config.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    const res = await request(app)
        .post('/api/users/register')
        .send({
            username: 'admin',
            email: 'admin@example.com',
            password: 'password123',
            role: 'admin'
        });

    token = res.body.token;
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Motor API', () => {
    it('should create a motor', async () => {
        const res = await request(app)
            .post('/api/motors')
            .set('x-auth-token', token)
            .send({
                model: 'CBR150R',
                brand: 'Honda'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('_id');
    });

    it('should get all motors', async () => {
        const res = await request(app)
            .get('/api/motors')
            .set('x-auth-token', token);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    });

    it('should get a motor by id', async () => {
        const motor = new Motor({ model: 'Ninja 250', brand: 'Kawasaki' });
        await motor.save();

        const res = await request(app)
            .get(`/api/motors/${motor._id}`)
            .set('x-auth-token', token);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('_id', motor._id.toString());
    });

    it('should update a motor', async () => {
        const motor = new Motor({ model: 'Vario 150', brand: 'Honda' });
        await motor.save();

        const res = await request(app)
            .put(`/api/motors/${motor._id}`)
            .set('x-auth-token', token)
            .send({
                model: 'Vario 160',
                brand: 'Honda'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('model', 'Vario 160');
    });

    it('should delete a motor', async () => {
        const motor = new Motor({ model: 'Aerox', brand: 'Yamaha' });
        await motor.save();

        const res = await request(app)
            .delete(`/api/motors/${motor._id}`)
            .set('x-auth-token', token);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('msg', 'Motor removed');
    });
});
