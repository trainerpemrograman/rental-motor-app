const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Motor = require('../models/Motor');
const Rental = require('../models/Rental');
const config = require('../config');

let token;
let motorId;

beforeAll(async () => {
    await mongoose.connect(config.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    const userRes = await request(app)
        .post('/api/users/register')
        .send({
            username: 'user',
            email: 'user@example.com',
            password: 'password123'
        });

    token = userRes.body.token;

    const motor = new Motor({ model: 'Nmax', brand: 'Yamaha' });
    await motor.save();
    motorId = motor._id;
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Rental API', () => {
    it('should create a rental', async () => {
        const res = await request(app)
            .post('/api/rentals')
            .set('x-auth-token', token)
            .send({
                motorId,
                rentalDate: '2024-07-01T00:00:00.000Z'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('_id');
    });

    it('should get all rentals', async () => {
        const res = await request(app)
            .get('/api/rentals')
            .set('x-auth-token', token);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    });

    it('should get a rental by id', async () => {
        const rental = new Rental({
            motor: motorId,
            user: mongoose.Types.ObjectId(),
            rentalDate: '2024-07-01T00:00:00.000Z'
        });
        await rental.save();

        const res = await request(app)
            .get(`/api/rentals/${rental._id}`)
            .set('x-auth-token', token);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('_id', rental._id.toString());
    });

    it('should update a rental', async () => {
        const rental = new Rental({
            motor: motorId,
            user: mongoose.Types.ObjectId(),
            rentalDate: '2024-07-01T00:00:00.000Z'
        });
        await rental.save();

        const res = await request(app)
            .put(`/api/rentals/${rental._id}`)
            .set('x-auth-token', token)
            .send({
                returnDate: '2024-07-02T00:00:00.000Z'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('returnDate', '2024-07-02T00:00:00.000Z');
    });

    it('should delete a rental', async () => {
        const rental = new Rental({
            motor: motorId,
            user: mongoose.Types.ObjectId(),
            rentalDate: '2024-07-01T00:00:00.000Z'
        });
        await rental.save();

        const res = await request(app)
            .delete(`/api/rentals/${rental._id}`)
            .set('x-auth-token', token);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('msg', 'Rental removed');
    });
});
