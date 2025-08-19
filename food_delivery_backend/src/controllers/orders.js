const getDb = require('../models');

/**
 * PUBLIC_INTERFACE
 * Orders controller for history, details, and status updates.
 */
class OrdersController {
  async myOrders(req, res) {
    try {
      const db = getDb();
      const rows = await db.Order.findAll({
        where: { user_id: req.user.id },
        order: [['placed_at', 'DESC']],
        include: [{ model: db.OrderItem, as: 'items' }, { model: db.Restaurant, as: 'restaurant' }],
      });
      return res.json({ status: 'ok', data: rows });
    } catch (e) {
      return res.status(500).json({ status: 'error', message: e.message });
    }
  }

  async detail(req, res) {
    try {
      const db = getDb();
      const { id } = req.params;
      const order = await db.Order.findByPk(id, {
        include: [
          { model: db.OrderItem, as: 'items', include: [{ model: db.MenuItem, as: 'menuItem' }] },
          { model: db.Restaurant, as: 'restaurant' },
          { model: db.OrderHistory, as: 'history' },
        ],
      });
      if (!order || (order.user_id !== req.user.id && req.user.role !== 'admin')) {
        return res.status(404).json({ status: 'error', message: 'Order not found' });
      }
      return res.json({ status: 'ok', data: order });
    } catch (e) {
      return res.status(500).json({ status: 'error', message: e.message });
    }
  }

  async updateStatus(req, res) {
    try {
      const db = getDb();
      const { id } = req.params;
      const { new_status } = req.body || {};
      const allowed = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
      if (!allowed.includes(new_status)) {
        return res.status(400).json({ status: 'error', message: 'Invalid status' });
      }
      const order = await db.Order.findByPk(id);
      if (!order) return res.status(404).json({ status: 'error', message: 'Order not found' });

      const previous_status = order.status;
      order.status = new_status;
      await order.save();

      await db.OrderHistory.create({
        order_id: order.id,
        previous_status,
        new_status,
        actor_user_id: req.user?.id || null,
        notes: `Status changed to ${new_status}`,
      });

      return res.json({ status: 'ok', data: order });
    } catch (e) {
      return res.status(500).json({ status: 'error', message: e.message });
    }
  }
}

module.exports = new OrdersController();
