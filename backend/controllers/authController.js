const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- User Registration Function ---
exports.register = async (req, res) => {
    const connection = await db.promise().getConnection();
    try {
        const { first_name, last_name, email, password, phone_number, plan } = req.body;

        const [existingUser] = await connection.query("SELECT email FROM Users WHERE email = ?", [email]);
        if (existingUser.length > 0) {
            connection.release();
            return res.status(400).json({ message: "An account with this email already exists." });
        }

        await connection.beginTransaction();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = { first_name, last_name, email, password: hashedPassword, phone_number };
        const [userResult] = await connection.query("INSERT INTO Users SET ?", newUser);
        const newUserId = userResult.insertId;

        const [planRows] = await connection.query("SELECT plan_id, duration_days FROM Plans WHERE plan_name LIKE ?", [`%${plan}%`]);
        
        if (planRows.length === 0) {
            await connection.rollback();
            connection.release();
            return res.status(400).json({ message: "Invalid plan selected." });
        }
        const planId = planRows[0].plan_id;
        const durationDays = planRows[0].duration_days;

        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + durationDays);

        const newSubscription = {
            user_id: newUserId,
            plan_id: planId,
            start_date: startDate.toISOString().slice(0, 10),
            end_date: endDate.toISOString().slice(0, 10)
        };
        await connection.query("INSERT INTO Subscriptions SET ?", newSubscription);

        await connection.commit();
        res.status(201).json({ message: "User registered successfully!" });

    } catch (error) {
        await connection.rollback();
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Server error during registration." });
    } finally {
        connection.release();
    }
};

// --- User/Admin Login Function ---
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const [users] = await db.promise().query("SELECT * FROM Users WHERE email = ?", [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: "Invalid credentials." });
        }
        const user = users[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const payload = {
            user: {
                id: user.user_id,
                role: user.role
            }
        };

        const JWT_SECRET = 'your_super_secret_key_that_is_long_and_random';

        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '3h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, role: user.role, message: "Login successful!" });
            }
        );

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error during login." });
    }
};