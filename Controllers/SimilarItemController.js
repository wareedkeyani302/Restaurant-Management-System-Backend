// const { pool } = require('../db');
// const natural = require('natural');
// const cosineSimilarity = require('cosine-similarity');

// const getMenuItems = async () => {
//     const [rows] = await pool.query('SELECT * FROM menu');
//     return rows;
// };

// exports.getSimilarMenuItems = async (req, res) => {
//     const { menu_id } = req.params;

//     if (!menu_id) {
//         return res.status(400).json({ error: 'Menu ID is required.' });
//     }

//     try {
//         // Fetch the menu item
//         const [menuItem] = await pool.query('SELECT * FROM menu WHERE id = ?', [menu_id]);

//         if (menuItem.length === 0) {
//             return res.status(404).json({ message: 'Menu item not found.' });
//         }

//         const { Item_name, Description } = menuItem[0];

//         // Fetch all menu items
//         const menuItems = await getMenuItems();

//         // Vectorize descriptions
//         const tokenizer = new natural.WordTokenizer();
//         const tfidf = new natural.TfIdf();

//         menuItems.forEach(item => tfidf.addDocument(item.Description));
//         const currentItemVector = tfidf.listTerms(tfidf.documents.length - 1).map(term => term.tfidf);

//         // Calculate similarity
//         const similarItems = menuItems
//             .filter(item => item.id !== menu_id)  // Exclude the current item
//             .map(item => {
//                 const itemVector = tfidf.listTerms(tfidf.documents.findIndex(doc => doc === item.Description)).map(term => term.tfidf);
//                 const similarity = cosineSimilarity(currentItemVector, itemVector);
//                 return { ...item, similarity };
//             });

//         // Sort items by similarity
//         similarItems.sort((a, b) => b.similarity - a.similarity);

//         if (similarItems.length === 0) {
//             return res.status(404).json({ message: 'No similar items found.' });
//         }

//         res.status(200).json(similarItems);
//     } catch (err) {
//         console.error('Error fetching similar menu items:', err);
//         res.status(500).json({ error: 'An error occurred while fetching similar menu items.' });
//     }
// };
