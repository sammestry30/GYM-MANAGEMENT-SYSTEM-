// File: controllers/userController.js
const db = require('../config/db');

// Existing Function: Get User Profile
exports.getUserProfile = async (req, res) => {
    try {
        const query = `
            SELECT 
                u.user_id, u.first_name, u.last_name, u.email, u.join_date,
                p.plan_name, s.end_date,
                (SELECT GROUP_CONCAT(ser.service_name SEPARATOR ', ') 
                 FROM Plan_Services ps 
                 JOIN Services ser ON ps.service_id = ser.service_id 
                 WHERE ps.plan_id = p.plan_id) AS services,
                CASE
                    WHEN s.end_date < CURDATE() THEN 'Expired'
                    ELSE s.status
                END AS subscription_status
            FROM Users u
            LEFT JOIN Subscriptions s ON u.user_id = s.user_id
            LEFT JOIN Plans p ON s.plan_id = p.plan_id
            WHERE u.user_id = ?
        `;

        const [users] = await db.promise().query(query, [req.user.id]);

        if (users.length === 0) {
            return res.status(404).json({ message: "User not found." });
        }
        
        const userProfile = {
            ...users[0],
            services: users[0].services ? users[0].services.split(', ') : []
        };

        res.json(userProfile);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Server error." });
    }
};

// NEW FUNCTION: Get User Notifications
exports.getNotifications = async (req, res) => {
    try {
        // Fetch notifications for the logged-in user, newest first
        const query = `SELECT * FROM Notifications WHERE user_id = ? ORDER BY created_at DESC`;
        
        // We use req.user.id because that is what your middleware provides
        const [notifications] = await db.promise().query(query, [req.user.id]);

        res.json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ message: "Server error." });
    }
};