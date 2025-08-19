const getDb = require('../models');

/**
 * PUBLIC_INTERFACE
 * Cart controller to manage user's cart and checkout.
 */
class CartController {
  async getOrCreateCart(db, userId) {
    let cart = await db.Cart.findOne({ where: { user_id: userId } });
    if (!cart) cart = await db.Cart.create({ user_id: userId, restaurant_id: null });
    return cart;
  }

  async get(req, res) {
    try {
      const db = getDb();
      const cart = await this.getOrCreateCart(db, req.user.id);
      const full = await db.Cart.findByPk(cart.id, {
        include: [{ model: db.CartItem, as: 'items', include: [{ model: db.MenuItem, as: 'menuItem' }] }],
      });
      return res.json({ status: 'ok', data: full });
    } catch (e) {
      return res.status(500).json({ status: 'error', message: e.message });
    }
  }

  async addItem(req, res) {
    try {
      const db = getDb();
      const { menu_item_id, quantity = 1, special_instructions } = req.body || {};
      if (!menu_item_id) return res.status(400).json({ status: 'error', message: 'menu_item_id is required' });

      const menuItem = await db.MenuItem.findByPk(menu_item_id);
      if (!menuItem || !menuItem.is_available) return res.status(404).json({ status: 'error', message: 'Menu item not available' });

      const cart = await this.getOrCreateCart(db, req.user.id);
      if (cart.restaurant_id && cart.restaurant_id !== menuItem.restaurant_id) {
        return res.status(400).json({ status: 'error', message: 'Cart contains items from another restaurant. Clear cart first.' });
      }
      if (!cart.restaurant_id) {
        cart.restaurant_id = menuItem.restaurant_id;
        await cart.save();
      }

      const unit_price = menuItem.price;
      const qty = Math.max(1, Number(quantity));
      const total_price = (Number(unit_price) * qty).toFixed(2);

      const existing = await db.CartItem.findOne({ where: { cart_id: cart.id, menu_item_id } });
      if (existing) {
        existing.quantity += qty;
        existing.total_price = (Number(existing.unit_price) * existing.quantity).toFixed(2);
        if (special_instructions) existing.special_instructions = special_instructions;
        await existing.save();
      } else {
        await db.CartItem.create({
          cart_id: cart.id,
          menu_item_id,
          quantity: qty,
          unit_price,
          total_price,
          special_instructions: special_instructions || null,
        });
      }

      return this.get(req, res);
    } catch (e) {
      return res.status(500).json({ status: 'error', message: e.message });
    }
  }

  async updateItem(req, res) {
    try {
      const db = getDb();
      const { itemId } = req.params;
      const { quantity, special_instructions } = req.body || {};
      const cart = await this.getOrCreateCart(db, req.user.id);
      const item = await db.CartItem.findOne({ where: { id: itemId, cart_id: cart.id } });
      if (!item) return res.status(404).json({ status: 'error', message: 'Item not found in cart' });
      if (quantity !== undefined) {
        const qty = Math.max(1, Number(quantity));
        item.quantity = qty;
        item.total_price = (Number(item.unit_price) * qty).toFixed(2);
      }
      if (special_instructions !== undefined) item.special_instructions = special_instructions;
      await item.save();
      return this.get(req, res);
    } catch (e) {
      return res.status(500).json({ status: 'error', message: e.message });
    }
  }

  async removeItem(req, res) {
    try {
      const db = getDb();
      const { itemId } = req.params;
      const cart = await this.getOrCreateCart(db, req.user.id);
      const item = await db.CartItem.findOne({ where: { id: itemId, cart_id: cart.id } });
      if (!item) return res.status(404).json({ status: 'error', message: 'Item not found in cart' });
      await item.destroy();

      // If cart has no items, clear restaurant lock
      const remaining = await db.CartItem.count({ where: { cart_id: cart.id } });
      if (remaining === 0) {
        cart.restaurant_id = null;
        await cart.save();
      }

      return this.get(req, res);
    } catch (e) {
      return res.status(500).json({ status: 'error', message: e.message });
    }
  }

  async clear(req, res) {
    try {
      const db = getDb();
      const cart = await this.getOrCreateCart(db, req.user.id);
      await db.CartItem.destroy({ where: { cart_id: cart.id } });
      cart.restaurant_id = null;
      await cart.save();
      return this.get(req, res);
    } catch (e) {
      return res.status(500).json({ status: 'error', message: e.message });
    }
  }

  async checkout(req, res) {
    try {
      const db = getDb();
      const cart = await this.getOrCreateCart(db, req.user.id);
      const items = await db.CartItem.findAll({ where: { cart_id: cart.id }, include: [{ model: db.MenuItem, as: 'menuItem' }] });
      if (!items.length) return res.status(400).json({ status: 'error', message: 'Cart is empty' });
      if (!cart.restaurant_id) return res.status(400).json({ status: 'error', message: 'Cart not associated with a restaurant' });

      // Compute totals
      const subtotal = items.reduce((acc, it) => acc + Number(it.total_price), 0);
      const tax = Number((subtotal * 0.1).toFixed(2)); // 10% example
      const delivery_fee = Number((subtotal > 50 ? 0 : 4.99).toFixed(2));
      const total = Number((subtotal + tax + delivery_fee).toFixed(2));

      const t = await db.sequelize.transaction();
      try {
        const order = await db.Order.create(
          {
            user_id: req.user.id,
            restaurant_id: cart.restaurant_id,
            status: 'pending',
            payment_status: 'pending',
            subtotal_amount: subtotal.toFixed(2),
            tax_amount: tax.toFixed(2),
            delivery_fee: delivery_fee.toFixed(2),
            total_amount: total.toFixed(2),
            delivery_address: req.body?.delivery_address || null,
            notes: req.body?.notes || null,
          },
          { transaction: t }
        );

        for (const it of items) {
          await db.OrderItem.create(
            {
              order_id: order.id,
              menu_item_id: it.menu_item_id,
              quantity: it.quantity,
              unit_price: it.unit_price,
              total_price: it.total_price,
              special_instructions: it.special_instructions,
            },
            { transaction: t }
          );
        }

        await db.OrderHistory.create(
          {
            order_id: order.id,
            previous_status: null,
            new_status: 'pending',
            actor_user_id: req.user.id,
            notes: 'Order placed',
          },
          { transaction: t }
        );

        // Clear cart
        await db.CartItem.destroy({ where: { cart_id: cart.id }, transaction: t });
        cart.restaurant_id = null;
        await cart.save({ transaction: t });

        await t.commit();

        return res.status(201).json({ status: 'ok', data: order });
      } catch (err) {
        await t.rollback();
        throw err;
      }
    } catch (e) {
      return res.status(500).json({ status: 'error', message: e.message });
    }
  }
}

module.exports = new CartController();
