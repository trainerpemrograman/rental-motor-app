const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Rental = require('../models/Rental');
const Motor = require('../models/Motor');

// @route   POST api/rentals
// @desc    Create a rental
// @access  Private
router.post('/', [auth, [
    check('motor', 'ID motor wajib diisi').not().isEmpty(),
    check('rentalDate', 'Tanggal rental wajib diisi').isISO8601()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { motor, rentalDate, returnDate } = req.body;

    try {
        let motorData = await Motor.findById(motor);

        if (!motorData) {
            return res.status(404).json({ msg: 'Data motor tidak ditemukan' });
        }

        const newRental = new Rental({
            motor,
            user: req.user.id,
            rentalDate,
            returnDate
        });

        const rental = await newRental.save();

        res.json(rental);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/rentals
// @desc    Get all rentals
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const rentals = await Rental.find().populate('motor').populate('user', '-password');
        res.json(rentals);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/rentals/:id
// @desc    Get rental by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const rental = await Rental.findById(req.params.id).populate('motor').populate('user', '-password');

        if (!rental) {
            return res.status(404).json({ msg: 'Data rental tidak ditemukan' });
        }

        res.json(rental);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/rentals/:id
// @desc    Update a rental
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { motor, rentalDate, returnDate } = req.body;

    // Build rental object
    const rentalFields = {};
    if (motor) rentalFields.motor = motor;
    if (rentalDate) rentalFields.rentalDate = rentalDate;
    if (returnDate) rentalFields.returnDate = returnDate;

    try {
        let rental = await Rental.findById(req.params.id);

        if (!rental) {
            return res.status(404).json({ msg: 'Data rental tidak ditemukan' });
        }

        rental = await Rental.findByIdAndUpdate(
            req.params.id,
            { $set: rentalFields },
            { new: true }
        );

        res.json(rental);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   DELETE api/rentals/:id
// @desc    Delete a rental
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const rental = await Rental.findById(req.params.id);

        if (!rental) {
            return res.status(404).json({ msg: 'Data rental tidak ditemukan' });
        }

        await Rental.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Data rental berhasil dihapus' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
