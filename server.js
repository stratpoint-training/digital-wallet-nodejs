const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorMiddleware = require('./middleware/error.middleware');
const mongoose = require('mongoose');

require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

const app = express();

app.use(cors());
app.use(express.json());

// Use routes
app.use('/api', routes);

// Error handling middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;