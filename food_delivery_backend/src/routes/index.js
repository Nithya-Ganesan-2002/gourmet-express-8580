const express = require('express');
const healthController = require('../controllers/health');

const authRoutes = require('./auth');
const restaurantRoutes = require('./restaurants');
const cartRoutes = require('./cart');
const ordersRoutes = require('./orders');
const profileRoutes = require('./profile');

const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /:
 *   get:
 *     tags: [Health]
 *     summary: Health endpoint
 *     responses:
 *       200:
 *         description: Service health check passed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Service is healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: development
 */
router.get('/', healthController.check.bind(healthController));

// Mount domain routes
router.use('/auth', authRoutes);
router.use('/restaurants', restaurantRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', ordersRoutes);
router.use('/profile', profileRoutes);

module.exports = router;
