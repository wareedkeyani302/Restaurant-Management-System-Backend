const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const { pool } = require('./db');
const userRoutes = require('./Routes/UserRoutes');
const AuthRoutes = require('./Routes/AuthRoutes');
const RestaurantRoutes = require('./Routes/RestaurantRoutes');
const MenuRoutes = require('./Routes/MenuRoutes');
const FeedbackRoutes = require('./Routes/FeedbackRoutes');
const PreferenceRoutes = require('./Routes/PreferenceRoutes');

const app = express();
const port = 8080;

app.use((req, res, next) => {
    if (!pool) {
        res.status(500).json({ error: 'Database connection is not established.' });
    } else {
        next();
    }
});

app.use(bodyParser.json());
app.use(cors());

app.use('/api', userRoutes);
app.use('/api', AuthRoutes);
app.use('/api', RestaurantRoutes);
app.use('/api', MenuRoutes);
app.use('/api', FeedbackRoutes);
app.use('/api', PreferenceRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});