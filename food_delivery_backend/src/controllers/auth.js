const getDb = require('../models');
const { hashPassword, verifyPassword } = require('../services/password');
const { issueToken } = require('../services/jwt');

/**
 * PUBLIC_INTERFACE
 * Authentication controller for register and login.
 */
class AuthController {
  /**
   * Register a new user (customer).
   */
  async register(req, res) {
    try {
      const db = getDb();
      const { email, password, full_name } = req.body || {};
      if (!email || !password) {
        return res.status(400).json({ status: 'error', message: 'email and password are required' });
      }
      const existing = await db.User.findOne({ where: { email } });
      if (existing) return res.status(409).json({ status: 'error', message: 'Email already in use' });

      const password_hash = hashPassword(password);
      const user = await db.User.create({ email, password_hash, role: 'customer' });
      await db.UserProfile.create({ user_id: user.id, full_name: full_name || null });
      const token = issueToken(user);
      return res.status(201).json({ status: 'ok', token, user: { id: user.id, email: user.email, role: user.role } });
    } catch (e) {
      return res.status(500).json({ status: 'error', message: e.message });
    }
  }

  /**
   * Login with email/password.
   */
  async login(req, res) {
    try {
      const db = getDb();
      const { email, password } = req.body || {};
      if (!email || !password) {
        return res.status(400).json({ status: 'error', message: 'email and password are required' });
      }
      const user = await db.User.findOne({ where: { email } });
      if (!user || !verifyPassword(password, user.password_hash)) {
        return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
      }
      user.last_login_at = new Date();
      await user.save();
      const token = issueToken(user);
      return res.json({ status: 'ok', token, user: { id: user.id, email: user.email, role: user.role } });
    } catch (e) {
      return res.status(500).json({ status: 'error', message: e.message });
    }
  }

  /**
   * Get current user info from token.
   */
  async me(req, res) {
    try {
      const db = getDb();
      const user = await db.User.findByPk(req.user.id, { include: [{ model: db.UserProfile, as: 'profile' }] });
      if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });
      return res.json({ status: 'ok', user });
    } catch (e) {
      return res.status(500).json({ status: 'error', message: e.message });
    }
  }
}

module.exports = new AuthController();
