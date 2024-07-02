const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config');

const app = express();

// Middleware
app.use(bodyParser.json());

// DB Config
const db = config.mongoURI;

// Connect to MongoDB
mongoose.connect(db)
    .then(() => console.log(' Database MongoDB Connected'))
    .catch(err => console.log(err));

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/motors', require('./routes/motorRoutes'));
app.use('/api/rentals', require('./routes/rentalRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
