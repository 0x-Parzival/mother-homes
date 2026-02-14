const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Load locations from JSON
const locationsPath = path.join(__dirname, 'locations.json');

app.get('/api/locations', (req, res) => {
    fs.readFile(locationsPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading locations file:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(JSON.parse(data));
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
