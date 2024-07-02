const Motor = require('../models/Motor');
const { validationResult } = require('express-validator');

exports.createMotor = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { model, brand, status } = req.body;
    try {
        let motor = new Motor({
            model,
            brand,
            status
        });

        await motor.save();
        res.json({
            success: true,
            message: 'Motor created successfully',
            data: motor
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getMotors = async (req, res) => {
    try {
        const motors = await Motor.find();
        res.json({
            success: true,
            message: 'Motors fetched successfully',
            data: motors
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getMotorById = async (req, res) => {
    try {
        const motor = await Motor.findById(req.params.id);
        if (!motor) {
            return res.status(404).json({ msg: 'Motor not found' });
        }
        res.json({
            success: true,
            message: 'Motor fetched successfully',
            data: motor
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.updateMotor = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { model, brand, status } = req.body;
    try {
        let motor = await Motor.findById(req.params.id);
        if (!motor) {
            return res.status(404).json({ msg: 'Motor not found' });
        }

        motor.model = model || motor.model;
        motor.brand = brand || motor.brand;
        motor.status = status || motor.status;

        await motor.save();
        res.json({
            success: true,
            message: 'Motor updated successfully',
            data: motor
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.deleteMotor = async (req, res) => {
    try {
        let motor = await Motor.findById(req.params.id);
        if (!motor) {
            return res.status(404).json({ msg: 'Motor not found' });
        }

        await motor.remove();
        res.json({
            success: true,
            message: 'Motor removed successfully',
            data: { id: motor.id }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};