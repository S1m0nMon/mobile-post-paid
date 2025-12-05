const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        // Validate Environment Variables
        if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SHEET_ID) {
            console.error('Missing Environment Variables');
            return res.status(500).json({
                error: 'Configuration error',
                message: 'Missing required environment variables. Check Vercel Settings.',
                details: {
                    hasEmail: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                    hasKey: !!process.env.GOOGLE_PRIVATE_KEY,
                    hasSheetId: !!process.env.GOOGLE_SHEET_ID
                }
            });
        }

        // Initialize auth - JWT
        const serviceAccountAuth = new JWT({
            email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            scopes: [
                'https://www.googleapis.com/auth/spreadsheets',
            ],
        });

        // Initialize doc - google-spreadsheet v4 syntax with explicit auth
        const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);

        await doc.loadInfo(); // loads document properties and worksheets

        // Append to the first sheet
        const sheet = doc.sheetsByIndex[0];

        await sheet.addRow({
            email: email,
            timestamp: new Date().toISOString()
        });

        res.status(200).json({ message: 'Successfully registered' });
    } catch (error) {
        console.error('Error saving to Google Sheets:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
