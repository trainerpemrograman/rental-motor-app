const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Motor = require('../models/Motor');

// @route   POST api/motors
// @desc    Create a motor
// @access  Private
router.post('/', [auth, [
    check('model', 'Model wajib diisi').not().isEmpty(),
    check('brand', 'Brand wajib diisi').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { model, brand, status } = req.body;

    try {
        const newMotor = new Motor({
            model,
            brand,
            status
        });

        const motor = await newMotor.save();

        res.json(motor);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/motors
// @desc    Get all motors
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const motors = await Motor.find();
        res.json(motors);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/motors/:id
// @desc    Get motor by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const motor = await Motor.findById(req.params.id);

        if (!motor) {
            return res.status(404).json({ msg: 'Data motor tidak ditemukan' });
        }

        res.json(motor);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/motors/:id
// @desc    Update a motor
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { model, brand, status } = req.body;

    // Build motor object
    const motorFields = {};
    if (model) motorFields.model = model;
    if (brand) motorFields.brand = brand;
    if (status) motorFields.status = status;

    try {
        let motor = await Motor.findById(req.params.id);

        if (!motor) {
            return res.status(404).json({ msg: 'Data motor tidak ditemukan' });
        }

        motor = await Motor.findByIdAndUpdate(
            req.params.id,
            { $set: motorFields },
            { new: true }
        );

        res.json(motor);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   DELETE api/motors/:id
// @desc    Delete a motor
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const motor = await Motor.findById(req.params.id);

        if (!motor) {
            return res.status(404).json({ msg: 'Data motor tidak ditemukan' });
        }

        await Motor.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Data motor berhasil dihapus' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
