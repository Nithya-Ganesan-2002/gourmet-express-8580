const express = require('express');
const cartController = require('../controllers/cart');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Cart
 *     description: Cart management
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     tags: [Cart]
 *     summary: Get my cart
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: OK }
 */
router.get('/', auth(), cartController.get.bind(cartController));

/**
 * @swagger
 * /cart/items:
 *   post:
 *     tags: [Cart]
 *     summary: Add item to cart
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [menu_item_id]
 *             properties:
 *               menu_item_id: { type: integer }
 *               quantity: { type: integer }
 *               special_instructions: { type: string }
 *     responses:
 *       200: { description: OK }
 */
router.post('/items', auth(), cartController.addItem.bind(cartController));

/**
 * @swagger
 * /cart/items/{itemId}:
 *   put:
 *     tags: [Cart]
 *     summary: Update item in cart
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 */
router.put('/items/:itemId', auth(), cartController.updateItem.bind(cartController));

/**
 * @swagger
 * /cart/items/{itemId}:
 *   delete:
 *     tags: [Cart]
 *     summary: Remove item from cart
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 */
router.delete('/items/:itemId', auth(), cartController.removeItem.bind(cartController));

/**
 * @swagger
 * /cart/clear:
 *   post:
 *     tags: [Cart]
 *     summary: Clear the cart
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: OK }
 */
router.post('/clear', auth(), cartController.clear.bind(cartController));

/**
 * @swagger
 * /cart/checkout:
 *   post:
 *     tags: [Orders]
 *     summary: Checkout and create order from cart
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Created }
 */
router.post('/checkout', auth(), cartController.checkout.bind(cartController));

module.exports = router;
