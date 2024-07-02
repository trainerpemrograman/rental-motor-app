const mongoose = require('mongoose');

const MotorSchema = new mongoose.Schema({
    model: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'rented'],
        default: 'available'
    }
});

module.exports = mongoose.model('Motor', MotorSchema);
