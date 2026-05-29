// File: server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors()); // Allows frontend to talk to backend
app.use(express.json());

// --- Define Routes ---
// Notice the path is '/api/user' (singular)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/user', require('./routes/userRoutes')); 
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/plans', require('./routes/plansRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));