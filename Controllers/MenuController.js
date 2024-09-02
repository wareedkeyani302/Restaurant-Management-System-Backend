const { pool } = require('../db');
const multer = require('multer');
const path = require('path');

const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 8 * 1024 * 1024 },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image file (jpg, jpeg, png).'));
        }
        cb(null, true);
    }
});

exports.upload = upload;

exports.addMenu = async (req, res) => {
    const { restaurant_id, Item_name, Description, Price } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!restaurant_id || !Item_name || !Price) {
        return res.status(400).json({ error: 'Restaurant ID, Item name, and Price are required.' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO menu (restaurant_id, Item_name, Description, Price, Image) VALUES (?, ?, ?, ?, ?)',
            [restaurant_id, Item_name, Description, Price, image]
        );
        res.status(201).json({ message: 'Restaurant added successfully', id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while adding the menu item.' });
    }
};

exports.getMenuByRestaurant = async (req, res) => {
    const { restaurant_id } = req.params;

    if (!restaurant_id) {
        return res.status(400).json({ error: 'Restaurant ID is required.' });
    }

    try {
        const [rows] = await pool.query('SELECT * FROM menu WHERE restaurant_id = ?', [restaurant_id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No menu items found for this restaurant.' });
        }

        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching menu items.' });
    }
};

exports.deleteMenuItem = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'Menu ID is required.' });
    }

    try {
        const [result] = await pool.query('DELETE FROM Menu WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'MenuItem not found.' });
        }

        res.status(200).json({ message: 'MenuItem deleted successfully' });
    } catch (error) {
        console.error('Error deleting Menu:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.updateMenuItem = async (req, res) => {
    const { id } = req.params;
    const { Item_name, Description, Price } = req.body;
    const Image = req.file ? req.file.path : null;

    if (!id || !Item_name || !Description || !Price) {
        return res.status(400).json({ error: 'ID, Item_name, Description, Price are required.' });
    }

    try {
        let query = 'UPDATE menu SET Item_name = ?, Description = ?, Price = ?';
        const params = [Item_name, Description, Price];

        if (Image) {
            query += ', Image = ?';
            params.push(Image);
        }

        query += ' WHERE id = ?';
        params.push(id);

        const [result] = await pool.query(query, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Menu item not found.' });
        }

        res.status(200).json({ message: 'Menu item updated successfully' });
    } catch (error) {
        console.error('Error updating Menu item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};