const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected!!'))
  .catch((err) => console.error('❌ DB Connection Error:', err));

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));