const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// File to store leads
const LEADS_FILE = path.join(__dirname, 'leads.json');

// Ensure leads file exists
if (!fs.existsSync(LEADS_FILE)) {
    fs.writeFileSync(LEADS_FILE, '[]');
}

// Routes
app.post('/api/register', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        // Read existing leads
        const leadsData = fs.readFileSync(LEADS_FILE, 'utf8');
        const leads = JSON.parse(leadsData);

        // Add new lead
        leads.push({
            email,
            timestamp: new Date().toISOString()
        });

        // Save back to file
        fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));

        console.log(`New lead registered: ${email}`);
        res.status(200).json({ message: 'Successfully registered' });
    } catch (error) {
        console.error('Error saving lead:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
