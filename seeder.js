const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');
const Motor = require('../models/Motor');
const Rental = require('../models/Rental');

const seedData = async () => {
    await mongoose.connect(config.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    console.log('MongoDB Connected');

    // Clear existing data
    await User.deleteMany({});
    await Motor.deleteMany({});
    await Rental.deleteMany({});

    // Create users
    const users = [
        {
            username: 'admin',
            email: 'admin@example.com',
            password: await bcrypt.hash('password123', 10),
            role: 'admin'
        },
        {
            username: 'user1',
            email: 'user1@example.com',
            password: await bcrypt.hash('password123', 10)
        },
        {
            username: 'user2',
            email: 'user2@example.com',
            password: await bcrypt.hash('password123', 10)
        }
    ];

    const createdUsers = await User.insertMany(users);

    // Create motors
    const motors = [
        {
            model: 'CBR150R',
            brand: 'Honda',
            status: 'available'
        },
        {
            model: 'Ninja 250',
            brand: 'Kawasaki',
            status: 'available'
        },
        {
            model: 'Vario 150',
            brand: 'Honda',
            status: 'available'
        }
    ];

    const createdMotors = await Motor.insertMany(motors);

    // Create rentals
    const rentals = [
        {
            motor: createdMotors[0]._id,
            user: createdUsers[1]._id,
            rentalDate: new Date('2024-07-01T00:00:00.000Z'),
            returnDate: new Date('2024-07-03T00:00:00.000Z')
        },
        {
            motor: createdMotors[1]._id,
            user: createdUsers[2]._id,
            rentalDate: new Date('2024-07-02T00:00:00.000Z'),
            returnDate: new Date('2024-07-04T00:00:00.000Z')
        }
    ];

    await Rental.insertMany(rentals);

    console.log('Data Seeded');
    mongoose.connection.close();
};

seedData().catch(err => console.log(err));
