const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const journalRoutes = require('./routes/journals');
const uploadRoutes = require('./routes/upload');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cognito-idp.ap-south-1.amazonaws.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://cognito-idp.ap-south-1.amazonaws.com", "https://*.amazonaws.com"],
    },
  },
  crossOriginOpenerPolicy: false,
}));

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
