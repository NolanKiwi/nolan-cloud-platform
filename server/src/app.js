const express = require('express');
const containerRoutes = require('./routes/containerRoutes');
const imageRoutes = require('./routes/imageRoutes');
const volumeRoutes = require('./routes/volumeRoutes');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/containers', containerRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/volumes', volumeRoutes);

// Health Check
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'Nolan Cloud Platform API' });
});

module.exports = app;
