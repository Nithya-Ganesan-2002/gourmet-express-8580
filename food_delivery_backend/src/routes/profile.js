const express = require('express');
const profileController = require('../controllers/profile');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User profiles
 */

/**
 * @swagger
 * /profile:
 *   get:
 *     tags: [Users]
 *     summary: Get my profile
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: OK }
 */
router.get('/', auth(), profileController.get.bind(profileController));

/**
 * @swagger
 * /profile:
 *   put:
 *     tags: [Users]
 *     summary: Update my profile
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: OK }
 */
router.put('/', auth(), profileController.update.bind(profileController));

module.exports = router;
