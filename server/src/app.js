const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const containerRoutes = require('./routes/containerRoutes');
const imageRoutes = require('./routes/imageRoutes');
const volumeRoutes = require('./routes/volumeRoutes');
const networkRoutes = require('./routes/networkRoutes');
const authRoutes = require('./routes/authRoutes');
const storageRoutes = require('./routes/storageRoutes');
const errorHandler = require('./middlewares/errorHandler'); // Global Error Handler

const app = express();

// Load OpenAPI Spec
const swaggerDocument = YAML.load(path.join(__dirname, '../docs/openapi.yaml'));

// Middleware
app.use(express.json());

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api/containers', containerRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/volumes', volumeRoutes);
app.use('/api/networks', networkRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/storage', storageRoutes);

// Health Check
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'Nolan Cloud Platform API',
    docs: '/api-docs'
  });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
