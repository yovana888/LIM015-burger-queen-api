require('../middleware/auth');
const {
  createOrder, getOrdersDb, getOrderById, updateSingle, deleteSingle,
} = require('../services/orders');

const { getProductById } = require('../services/products');
const { convertToLinks } = require('../utils/util');

module.exports = {
  getOrders: async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const { protocol, host } = req.headers;
    const orders = await getOrdersDb(Number(page), Number(limit));
    if (orders) {
      const totalPages = Math.ceil((await getOrdersDb(1, 0)).length / limit);
      const link = convertToLinks(protocol, host, 'orders', limit, page, totalPages);
      res.set('Link', JSON.stringify(link));
      return res.json(orders);
    }
    return res.json('Database has not orders');
  },
  getOrderById: async (req, res) => {
    const order = await getOrderById(req.params.orderId);
    if (!order) return res.status(404).json({ message: `Order: ${req.params.orderId} does not exists` });
    res.json(order);
  },
  createOrder: async (req, res) => {
    const {
      userId, client, products, status,
    } = req.body;
    if (userId && products && products.length !== 0) {
      let message = '';
      await products.forEach(async (p) => {
        const productFound = await getProductById(p.productId);
        if (!productFound) {
          message = `Product con id: ${p.productId} does not exists`;
        }
      });
      if (status && !(['pending', 'preparing', 'canceled', 'delivering', 'delivered'].includes(status))) {
        return res.status(400).json({ message: 'Invalid status value' });
      }
      if (message.length !== 0) return res.status(404).json({ message });
      const order = await createOrder(userId, client, products);
      return res.json(order);
    }
    return res.status(400).json({ message: 'userId or Products not found' });
  },

  putOrder: async (req, res) => {
    const order = await getOrderById(req.params.orderId);
    if (!order) return res.status(404).json({ message: `Order con id: ${req.params.orderId} does not exists` });
    const {
      userId, client, products, status,
    } = req.body;
    if (userId || client || products || status) {
      let message = '';
      if (status && !(['pending', 'preparing', 'canceled', 'delivering', 'delivered'].includes(status))) {
        return res.status(400).json({ message: 'Invalid status value' });
      }
      if (products && products.length !== 0) {
        await products.forEach(async (p) => {
          const productFound = await getProductById(p.productId);
          if (!productFound) {
            message = `Product con id: ${p.productId} does not exists`;
          }
        });
      }
      if (message.length !== 0) return res.status(404).json({ message });
      const orderUpdated = await updateSingle(order._id, req.body);
      return res.json(orderUpdated);
    }
    return res.status(400).json({ message: 'Properties not found' });
  },
  deleteOrder: async (req, res) => {
    const order = await getOrderById(req.params.orderId);
    if (!order) return res.status(404).json({ message: `Order: ${req.params.orderId} does not exists` });
    await deleteSingle(order._id);
    res.json(order);
  },
};
