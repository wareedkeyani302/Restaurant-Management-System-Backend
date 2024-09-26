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

        await updateRecommendations(user_id, menu_id);

        res.status(201).json({ message: 'Feedback submitted successfully', feedbackId: result.insertId });
    } catch (err) {
        console.error('Error submitting feedback:', err);
        res.status(500).json({ error: 'An error occurred while submitting feedback.' });
    }
};

async function updateRecommendations(user_id, menu_id) {
    try {

        const [menuItem] = await pool.query('SELECT * FROM menu WHERE id = ?', [menu_id]);

        if (menuItem.length === 0) return;

        const { restaurant_id, Item_name, Description } = menuItem[0];

        const [similarItems] = await pool.query(
            'SELECT * FROM menu WHERE restaurant_id != ? AND (Item_name LIKE ? OR Description LIKE ?) LIMIT 10',
            [restaurant_id, `%${Item_name}%`, `%${Description}%`]
        );

        for (const item of similarItems) {
            await pool.query(
                'INSERT INTO Recommendations (user_id, menu_id) VALUES (?, ?)',
                [user_id, item.id]
            );
        }
    } catch (error) {
        console.error('Error updating recommendations:', error);
    }
}