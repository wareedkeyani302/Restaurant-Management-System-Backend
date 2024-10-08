const { pool } = require('../db');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        const [rows] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const { username, role, email: userEmail, user_id } = user;
        const recommendations = await getUserRecommendations(user.user_id);

        res.status(200).json({ username, role, email: userEmail, user_id, recommendations });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

async function getUserRecommendations(user_id) {
    try {
        const [recommendations] = await pool.query(
            'SELECT menu.* FROM Recommendations r JOIN menu ON r.menu_id = menu.id WHERE r.user_id = ?',
            [user_id]
        );

        return recommendations;
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        return [];
    }
}