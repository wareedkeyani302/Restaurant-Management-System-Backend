const { pool } = require('../db');

exports.addFeedback = async (req, res) => {
    const { user_id, menu_id, Rating, Comment } = req.body;

    if (!user_id || !menu_id || !Rating || Rating < 1 || Rating > 5) {
        return res.status(400).json({ error: 'Invalid input. Ensure all fields are provided and rating is between 1 and 5.' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO Feedback (user_id, menu_id, Rating, Comment) VALUES (?, ?, ?, ?)',
            [user_id, menu_id, Rating, Comment]
        );

        res.status(201).json({ message: 'Feedback submitted successfully', feedbackId: result.insertId });
    } catch (err) {
        console.error('Error submitting feedback:', err);
        res.status(500).json({ error: 'An error occurred while submitting feedback.' });
    }
};
