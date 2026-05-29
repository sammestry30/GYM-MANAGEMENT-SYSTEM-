// File: controllers/plansController.js

const db = require('../config/db');

exports.getAllPlans = async (req, res) => {
    try {
        // This query fetches all plans and groups their associated services into a single string
        const query = `
            SELECT 
                p.plan_id,
                p.plan_name,
                p.price,
                p.duration_days,
                GROUP_CONCAT(s.service_name SEPARATOR ', ') AS services
            FROM Plans p
            LEFT JOIN Plan_Services ps ON p.plan_id = ps.plan_id
            LEFT JOIN Services s ON ps.service_id = s.service_id
            GROUP BY p.plan_id
            ORDER BY p.price;
        `;
        
        const [plans] = await db.promise().query(query);

        // Convert the service string into an array for each plan
        const formattedPlans = plans.map(plan => ({
            ...plan,
            services: plan.services ? plan.services.split(', ') : []
        }));

        res.json(formattedPlans);
    } catch (error) {
        console.error("Error fetching plans:", error);
        res.status(500).json({ message: "Server error." });
    }
};