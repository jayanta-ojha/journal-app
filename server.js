const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const journalRoutes = require('./routes/journals');
const uploadRoutes = require('./routes/upload');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/journals', journalRoutes);
app.use('/upload', uploadRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Journal API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
