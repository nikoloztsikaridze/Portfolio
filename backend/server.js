cat > server.js << 'EOF'
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: 5432,
    database: 'portfolio_db',
    user: 'portfolio_user',
    password: 'mypassword123'
});

// Database Table შექმნა
const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS contact_messages (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Database table ready');
    } catch (error) {
        console.error('❌ Database error:', error);
    }
};

initDB();

// API Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'API is running' });
});

// Contact Form Submission
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({ 
                success: false, 
                message: 'გთხოვთ შეავსოთ ყველა ველი!' 
            });
        }

        // Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'გთხოვთ შეიყვანოთ ვალიდური Email!' 
            });
        }

        // Save to Database
        const result = await pool.query(
            'INSERT INTO contact_messages (name, email, message) VALUES ($1, $2, $3) RETURNING *',
            [name, email, message]
        );

        console.log('📩 New message saved:', result.rows[0]);

        res.json({ 
            success: true, 
            message: 'შეტყობინება წარმატებით გაიგზავნა! ✓',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'სერვერის შეცდომა. სცადეთ თავიდან.' 
        });
    }
});

// Get all messages (Admin)
app.get('/api/messages', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM contact_messages ORDER BY created_at DESC'
        );
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Backend API running on http://localhost:${PORT}`);
});
EOF
