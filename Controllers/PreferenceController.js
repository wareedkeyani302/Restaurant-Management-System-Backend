const {pool} = require('../db');

exports.getMenuByRestaurant = async (req, res) => {
    const { restaurant_id, user_id } = req.params;

    if (!restaurant_id) {
        return res.status(400).json({ error: 'Restaurant ID is required.' });
    }

    try {
        let query = `
            SELECT menu.*, 
                   COALESCE(feedback.Rating, 0) AS user_rating
            FROM menu
            LEFT JOIN feedback ON menu.id = feedback.menu_id AND feedback.user_id = ?
            WHERE menu.restaurant_id = ?
            ORDER BY CASE WHEN feedback.user_id IS NOT NULL THEN 0 ELSE 1 END, 
                     user_rating DESC
        `;
        const [rows] = await pool.query(query, [user_id, restaurant_id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No menu items found for this restaurant.' });
        }

        res.status(200).json(rows);
    } catch (err) {
        console.error('Error fetching menu items by restaurant:', err);
        res.status(500).json({ error: 'An error occurred while fetching menu items.' });
    }
};



