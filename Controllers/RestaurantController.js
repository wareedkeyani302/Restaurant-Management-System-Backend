const { pool } = require('../db');
const multer = require('multer');
const path = require('path');

const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image file (jpg, jpeg, png).'));
        }
        cb(null, true);
    }
});

exports.upload = upload;

exports.addRestaurant = async (req, res) => {
    const { Name, Address, Phone, Email } = req.body;
    const logoImage = req.file ? req.file.path : null;

    if (!Name || !Address || !Phone || !Email) {
        return res.status(400).json({ error: 'Name, Address, Phone, and Email are required.' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO Restaurants (Name, Address, Phone, Email, Logo_image) VALUES (?, ?, ?, ?, ?)',
            [Name, Address, Phone, Email, logoImage]
        );

        res.status(201).json({ message: 'Restaurant added successfully', restaurantId: result.insertId });
    } catch (error) {
        console.error('Error adding restaurant:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getRestaurants = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Restaurants');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getRestaurantById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'Restaurant ID is required.' });
    }

    try {
        const [rows] = await pool.query('SELECT * FROM Restaurants WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Restaurant not found.' });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Error fetching restaurant by ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteRestaurant = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'Restaurant ID is required.' });
    }

    try {
        const [result] = await pool.query('DELETE FROM Restaurants WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Restaurant not found.' });
        }

        res.status(200).json({ message: 'Restaurant deleted successfully' });
    } catch (error) {
        console.error('Error deleting restaurant:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateRestaurant = async (req, res) => {
    const { id } = req.params;
    const { Name, Address, Phone, Email } = req.body;
    const logoImage = req.file ? req.file.path : null;

    if (!id || !Name || !Address || !Phone || !Email) {
        return res.status(400).json({ error: 'ID, Name, Address, Phone, and Email are required.' });
    }

    try {

        let query = 'UPDATE Restaurants SET Name = ?, Address = ?, Phone = ?, Email = ?';
        const params = [Name, Address, Phone, Email];

        if (logoImage) {
            query += ', Logo_image = ?';
            params.push(logoImage);
        }

        query += ' WHERE id = ?';
        params.push(id);

        const [result] = await pool.query(query, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Restaurant not found.' });
        }

        res.status(200).json({ message: 'Restaurant updated successfully' });
    } catch (error) {
        console.error('Error updating restaurant:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};