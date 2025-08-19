const express = require('express');
const ordersController = require('../controllers/orders');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Orders
 *     description: Orders and tracking
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     tags: [Orders]
 *     summary: Get my orders
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: OK }
 */
router.get('/', auth(), ordersController.myOrders.bind(ordersController));

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Get order details
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not found }
 */
router.get('/:id', auth(), ordersController.detail.bind(ordersController));

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     tags: [Orders]
 *     summary: Update order status (admin or internal use)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [new_status]
 *             properties:
 *               new_status:
 *                 type: string
 *                 enum: [pending, confirmed, preparing, out_for_delivery, delivered, cancelled]
 *     responses:
 *       200: { description: OK }
 */
router.patch('/:id/status', auth(false), ordersController.updateStatus.bind(ordersController));

module.exports = router;
