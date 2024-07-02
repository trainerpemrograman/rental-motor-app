const mongoose = require('mongoose');

const RentalSchema = new mongoose.Schema({
    motor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Motor',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rentalDate: {
        type: Date,
        required: true
    },
    returnDate: {
        type: Date
    }
});

module.exports = mongoose.model('Rental', RentalSchema);
