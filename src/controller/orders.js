const { createOrder, getOrders, getOrderById, updateSingle, deleteSingle } = require("../services/orders");

const { getProductById } = require("../services/products");

module.exports = {
  getOrders: async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const host = req.headers.host;
    const totalPages = Math.ceil((await getOrders(1, 0)).length / limit);
    const orders = await getOrders(Number(page), Number(limit));
    const link = {
      first: page === 1 ? "" : `http://${host}/orders?page=1`,
      next: page === totalPages ? "" : `http://${host}/orders?page=${Number(page) + 1}`,
      prev: page === 1 ? "" : `http://${host}/orders?page=${Number(page) - 1}`,
      last: page === totalPages ? "" : `http://${host}/orders?page=${totalPages}`,
    };
    res.set("Link", JSON.stringify(link));
    res.json(orders);
  },
  getOrderById: async (req, res) => {
    const order = await getOrderById(req.params.orderId);
    if (!order) return res.status(404).json({ message: `Order: ${req.params.orderId} does not exists` });
    res.json(order);
  },
  createOrder: async (req, res) => {
    const { userId, client, products } = req.body;
    if (userId && products && products.length !== 0) {
      let message = "";
      await products.forEach(async p => {
        const productFound = await getProductById(p.productId);
        if (!productFound) return (message = `Product con id: ${p.productId} does not exists`);
      });
      if (message.length !== 0) return res.status(404).json({ message });
      const order = await createOrder(userId, client, products);
      res.json(order);
    } else {
      return res.status(400).json({ message: "userId or Products not found" });
    }
  },

  putOrder: async (req, res) => {
    const order = await getOrderById(req.params.orderId);
    if (!order) return res.status(404).json({ message: `Order con id: ${req.params.orderId} does not exists` });
    const { userId, client, products, status } = req.body;
    if (userId || client || products || status) {
      let message = "";
      if (products && products.length !== 0) {
        await products.forEach(async p => {
          const productFound = await getProductById(p.productId);
          if (!productFound) {
            return (message = `Product con id: ${p.productId} does not exists`);
          }
        });
      }
      if (message.length !== 0) return res.status(404).json({ message });
      if (status && !["pending", "canceled", "delivering", "delivered"].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      const orderUpdated = await updateSingle(order._id, req.body);
      res.json(orderUpdated);
    } else {
      return res.status(400).json({ message: "Properties not found" });
    }
  },
  deleteOrder: async (req, res) => {
    const order = await getOrderById(req.params.orderId);
    if (!order) return res.status(404).json({ message: `Order: ${req.params.orderId} does not exists` });
    await deleteSingle(order._id);
    res.json(order);
  },
};
