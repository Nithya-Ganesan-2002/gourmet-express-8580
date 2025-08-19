const getDb = require('../models');

/**
 * PUBLIC_INTERFACE
 * Restaurants and Menus controller.
 */
class RestaurantsController {
  async list(req, res) {
    try {
      const db = getDb();
      const { q, city, cuisine, limit = 20, offset = 0 } = req.query;
      const where = {};
      if (city) where.city = city;
      if (cuisine) where.cuisine_type = cuisine;
      if (q) where.name = db.Sequelize.where(db.sequelize.fn('LOWER', db.sequelize.col('name')), 'LIKE', `%${q.toLowerCase()}%`);
      const rows = await db.Restaurant.findAll({ where, limit: Number(limit), offset: Number(offset) });
      return res.json({ status: 'ok', data: rows });
    } catch (e) {
      return res.status(500).json({ status: 'error', message: e.message });
    }
  }

  async detail(req, res) {
    try {
      const db = getDb();
      const { id } = req.params;
      const row = await db.Restaurant.findByPk(id, { include: [{ model: db.MenuItem, as: 'menuItems' }] });
      if (!row) return res.status(404).json({ status: 'error', message: 'Restaurant not found' });
      return res.json({ status: 'ok', data: row });
    } catch (e) {
      return res.status(500).json({ status: 'error', message: e.message });
    }
  }

  async menu(req, res) {
    try {
      const db = getDb();
      const { id } = req.params;
      const restaurant = await db.Restaurant.findByPk(id);
      if (!restaurant) return res.status(404).json({ status: 'error', message: 'Restaurant not found' });
      const items = await db.MenuItem.findAll({ where: { restaurant_id: id, is_available: true } });
      return res.json({ status: 'ok', data: items });
    } catch (e) {
      return res.status(500).json({ status: 'error', message: e.message });
    }
  }
}

module.exports = new RestaurantsController();
