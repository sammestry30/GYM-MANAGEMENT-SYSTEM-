// File: controllers/contactController.js
const db = require('../config/db');

exports.submitReview = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const newReview = { name, email, message };
        
        await db.promise().query("INSERT INTO Reviews SET ?", newReview);
        
        res.status(201).json({ message: "Thank you for your feedback!" });
    } catch (error) {
        console.error("Error submitting review:", error);
        res.status(500).json({ message: "Server error." });
    }
};