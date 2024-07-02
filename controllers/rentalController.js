const Rental = require('../models/Rental');
const Motor = require('../models/Motor');
const { validationResult } = require('express-validator');

exports.createRental = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { motorId, rentalDate, returnDate } = req.body;
    try {
        const motor = await Motor.findById(motorId);
        if (!motor || motor.status !== 'available') {
            return res.status(400).json({ msg: 'Motor not available' });
        }

        const rental = new Rental({
            motor: motorId,
            user: req.user.id,
            rentalDate,
            returnDate
        });

        await rental.save();

        motor.status = 'rented';
        await motor.save();

        res.json({
            success: true,
            message: 'Rental created successfully',
            data: rental
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getRentals = async (req, res) => {
    try {
        const rentals = await Rental.find().populate('motor').populate('user');
        res.json({
            success: true,
            message: 'Rentals fetched successfully',
            data: rentals
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getRentalById = async (req, res) => {
    try {
        const rental = await Rental.findById(req.params.id).populate('motor').populate('user');
        if (!rental) {
            return res.status(404).json({ msg: 'Rental not found' });
        }
        res.json({
            success: true,
            message: 'Rental fetched successfully',
            data: rental
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.updateRental = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { returnDate } = req.body;
    try {
        const rental = await Rental.findById(req.params.id);
        if (!rental) {
            return res.status(404).json({ msg: 'Rental not found' });
        }

        rental.returnDate = returnDate || rental.returnDate;
        await rental.save();

        if (returnDate) {
            const motor = await Motor.findById(rental.motor);
            motor.status = 'available';
            await motor.save();
        }

        res.json({
            success: true,
            message: 'Rental updated successfully',
            data: rental
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.deleteRental = async (req, res) => {
    try {
        const rental = await Rental.findById(req.params.id);
        if (!rental) {
            return res.status(404).json({ msg: 'Rental not found' });
        }

        const motor = await Motor.findById(rental.motor);
        motor.status = 'available';
        await motor.save();

        await rental.remove();
        res.json({
            success: true,
            message: 'Rental removed successfully',
            data: { id: rental.id }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};