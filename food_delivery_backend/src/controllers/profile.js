const getDb = require('../models');

/**
 * PUBLIC_INTERFACE
 * Profile controller to get and update user profile.
 */
class ProfileController {
  async get(req, res) {
    try {
      const db = getDb();
      const profile = await db.UserProfile.findOne({ where: { user_id: req.user.id } });
      return res.json({ status: 'ok', data: profile });
    } catch (e) {
      return res.status(500).json({ status: 'error', message: e.message });
    }
  }

  async update(req, res) {
    try {
      const db = getDb();
      const profile = await db.UserProfile.findOne({ where: { user_id: req.user.id } });
      if (!profile) return res.status(404).json({ status: 'error', message: 'Profile not found' });
      const updatable = [
        'full_name',
        'phone',
        'address_line1',
        'address_line2',
        'city',
        'state',
        'postal_code',
        'country',
        'avatar_url',
      ];
      for (const key of updatable) {
        if (req.body[key] !== undefined) profile[key] = req.body[key];
      }
      await profile.save();
      return res.json({ status: 'ok', data: profile });
    } catch (e) {
      return res.status(500).json({ status: 'error', message: e.message });
    }
  }
}

module.exports = new ProfileController();
