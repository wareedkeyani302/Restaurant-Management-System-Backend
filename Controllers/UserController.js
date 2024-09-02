const { pool } = require('../db');
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.signup = async (req, res) => {
    const { username, password, email, role } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ error: 'Username, password, and email are required.' });
    }

    try {
        const [existingUser] = await pool.query('SELECT * FROM Users WHERE username = ? OR email = ?', [username, email]);

        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Username or email already exists.' });
        }
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const [result] = await pool.query('INSERT INTO Users (username, password, email, role) VALUES (?, ?, ?, ?)', [username, hashedPassword, email, role || 'user']);

        res.status(201).json({ message: 'User created successfully', userId: result.insertId });
    } catch (error) {
        console.error('Error signing up user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteUsers = async (req, res) => {
    const { user_id } = req.params;

    if (!user_id) {
        return res.status(400).json({ error: 'User ID is required.' });
    }

    try {
        const [result] = await pool.query('DELETE FROM Users WHERE user_id = ?', [user_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting User:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Users');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching Users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getUserById = async (req, res) => {
    const { user_id } = req.params;

    if (!user_id) {
        return res.status(400).json({ error: 'User ID is required.' });
    }

    try {
        const [rows] = await pool.query('SELECT * FROM Users WHERE user_id = ?', [user_id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Error fetching User by ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateUser = async (req, res) => {
    const { user_id } = req.params;
    const { username, password, email, role } = req.body;

    if (!user_id) {
        return res.status(400).json({ error: 'User ID is required.' });
    }

    if (!username && !email && !password && !role) {
        return res.status(400).json({ error: 'At least one field (username, email, password or role ) is required to update.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const [result] = await pool.query(
            'UPDATE Users SET username = COALESCE(?, username), email = COALESCE(?, email), password = COALESCE(?, password), role = COALESCE(?, role) WHERE user_id = ?',
            [username, email, hashedPassword, role, user_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating User:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};