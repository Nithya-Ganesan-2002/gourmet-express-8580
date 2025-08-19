const express = require('express');
const restaurantsController = require('../controllers/restaurants');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Restaurants
 *     description: Restaurants and menus
 */

/**
 * @swagger
 * /restaurants:
 *   get:
 *     tags: [Restaurants]
 *     summary: List restaurants
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *       - in: query
 *         name: city
 *         schema: { type: string }
 *       - in: query
 *         name: cuisine
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 */
router.get('/', restaurantsController.list.bind(restaurantsController));

/**
 * @swagger
 * /restaurants/{id}:
 *   get:
 *     tags: [Restaurants]
 *     summary: Get restaurant details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not found }
 */
router.get('/:id', restaurantsController.detail.bind(restaurantsController));

/**
 * @swagger
 * /restaurants/{id}/menu:
 *   get:
 *     tags: [Restaurants]
 *     summary: Get restaurant menu
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not found }
 */
router.get('/:id/menu', restaurantsController.menu.bind(restaurantsController));

module.exports = router;
