const cors = require('cors');
const express = require('express');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');
const getDb = require('./models');

// Initialize express app
const app = express();

// Initialize DB connection early and attempt sync if configured
(async () => {
  try {
    const db = getDb();
    await db.sequelize.authenticate();
    await db.syncDatabase();
    console.log('[DB] Connection established successfully');
  } catch (err) {
    console.error('[DB] Unable to connect to the database:', err.message);
  }
})();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.set('trust proxy', true);
app.use('/docs', swaggerUi.serve, (req, res, next) => {
  const host = req.get('host');           // may or may not include port
  let protocol = req.protocol;          // http or https

  const actualPort = req.socket.localPort;
  const hasPort = host.includes(':');
  
  const needsPort =
    !hasPort &&
    ((protocol === 'http' && actualPort !== 80) ||
     (protocol === 'https' && actualPort !== 443));
  const fullHost = needsPort ? `${host}:${actualPort}` : host;
  protocol = req.secure ? 'https' : protocol;

  const dynamicSpec = {
    ...swaggerSpec,
    servers: [
      {
        url: `${protocol}://${fullHost}`,
      },
    ],
  };
  swaggerUi.setup(dynamicSpec)(req, res, next);
});

// Parse JSON request body
app.use(express.json());

// DB health endpoint
/**
 * @swagger
 * /db/health:
 *   get:
 *     tags:
 *       - Database
 *     summary: Database health check
 *     description: Returns connectivity status to the configured database.
 *     responses:
 *       200:
 *         description: Database connection works.
 *       500:
 *         description: Database connection failed.
 */
app.get('/db/health', async (req, res) => {
  const db = getDb();
  try {
    await db.sequelize.authenticate();
    return res.status(200).json({ status: 'ok', message: 'Database connected' });
  } catch (e) {
    return res.status(500).json({ status: 'error', message: e.message });
  }
});

// Mount routes
app.use('/', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});

module.exports = app;
