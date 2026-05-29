// This is the complete and final code for controllers/adminController.js

const db = require('../config/db');

// Fetches all clients with their subscription and service details
exports.getAllClients = async (req, res) => {
    try {
        const query = `
            SELECT 
                u.user_id, u.first_name, u.last_name, u.email, u.join_date,
                p.plan_name,
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
            WHERE u.role = 'client'
        `;
        
        const [clients] = await db.promise().query(query);

        // Format the services string into an array for easier use on the frontend
        const formattedClients = clients.map(client => ({
            ...client,
            services: client.services ? client.services.split(', ') : []
        }));

        res.json(formattedClients);
    } catch (error) {
        console.error("Error fetching clients:", error);
        res.status(500).json({ message: "Server error." });
    }
};

// Fetches all user-submitted reviews
exports.getAllReviews = async (req, res) => {
    try {
        const [reviews] = await db.promise().query("SELECT * FROM Reviews ORDER BY created_at DESC");
        res.json(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ message: "Server error." });
    }
};

// Deletes a specific client and their associated subscription
exports.deleteClient = async (req, res) => {
    const connection = await db.promise().getConnection();
    try {
        const { id } = req.params;

        await connection.beginTransaction();

        await connection.query("DELETE FROM Subscriptions WHERE user_id = ?", [id]);
        
        const [result] = await connection.query("DELETE FROM Users WHERE user_id = ?", [id]);

        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ message: "Client not found." });
        }

        await connection.commit();
        
        res.json({ message: "Client deleted successfully." });

    } catch (error) {
        await connection.rollback();
        console.error("Error deleting client:", error);
        res.status(500).json({ message: "Server error." });
    } finally {
        connection.release();
    }
};
// REPLACE the existing getDashboardStats function with this correct version

exports.getDashboardStats = async (req, res) => {
    try {
        // Query 1: Get total number of clients
        const [membersResult] = await db.promise().query("SELECT COUNT(*) as count FROM Users WHERE role = 'client'");
        const totalMembers = membersResult[0].count;

        // Query 2: Get active subscriptions (where the end date is today or in the future)
        const [activeSubsResult] = await db.promise().query("SELECT COUNT(*) as count FROM Subscriptions WHERE end_date >= CURDATE()");
        const activeSubscriptions = activeSubsResult[0].count;

        // Query 3: Get total number of reviews
        const [reviewsResult] = await db.promise().query("SELECT COUNT(*) as count FROM Reviews");
        const totalReviews = reviewsResult[0].count;

        // Send all three stats back in a single JSON object
        res.status(200).json({
            totalMembers,
            activeSubscriptions,
            totalReviews
        });

    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ message: "Server error." });
    }
};