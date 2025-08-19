const express = require('express');
const authController = require('../controllers/auth');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User accounts and authentication
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Users]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string, format: password }
 *               full_name: { type: string }
 *     responses:
 *       201: { description: Created }
 *       409: { description: Email already used }
 */
router.post('/register', authController.register.bind(authController));

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Users]
 *     summary: Login with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string, format: password }
 *     responses:
 *       200: { description: OK }
 *       401: { description: Invalid credentials }
 */
router.post('/login', authController.login.bind(authController));

/**
 * @swagger
 * /auth/me:
 *   get:
 *     tags: [Users]
 *     summary: Get current authenticated user
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: OK }
 *       401: { description: Unauthorized }
 */
router.get('/me', auth(), authController.me.bind(authController));

module.exports = router;
