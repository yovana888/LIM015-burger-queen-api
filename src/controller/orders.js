const {
  createOrder,
  getOrders,
  getOrderById,
  getOrderByUserId,
  updateSingle,
  deleteSingle,
} = require("../services/products");

module.exports = {
  getOrders: async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const host = req.headers.host;
    const totalPages = Math.ceil((await getProducts(1, 0)).length / limit);
    const products = await getProducts(Number(page), Number(limit));
    const link = {
      first: page === 1 ? "" : `http://${host}/products?page=1`,
      next: page === totalPages ? "" : `http://${host}/products?page=${Number(page) + 1}`,
      prev: page === 1 ? "" : `http://${host}/products?page=${Number(page) - 1}`,
      last: page === totalPages ? "" : `http://${host}/products?page=${totalPages}`,
    };
    res.set("Link", JSON.stringify(link));
    res.json(products);
  },
  getOrderById: async (req, res) => {
    const product = await getProductId(req.params.productId);
    if (!product) return res.status(404).json({ message: `Product: ${req.params.productId} does not exists` });
    res.json(product);
  },
  createOrder: async (req, res) => {
    const { name, price, image, type } = req.body;
    if (!name || !price) return res.status(400).json({ message: "Name or Price not found" });
    const productFound = await getProductByName(name);
    if (productFound) return res.status(403).json({ message: `Product: ${name} already exists` });
    const product = await createNewProduct(name, price, image, type);
    res.json(product);
  },
  putOrder: async (req, res) => {
    const product = await getProductId(req.params.productId);
    if (!product) return res.status(404).json({ message: `Product: ${req.params.productId} does not exists` });
    // if (!req.userToken.admin) return res.status(403).json({ message: "Admin permission is required" });
    const body = req.body;
    if (!body) return res.status(400).json({ message: "Properties not found" });
    const productUpdated = await updateSingle(product._id, body);
    res.json(productUpdated);
  },
  deleteOrder: async (req, res) => {
    const product = await getProductId(req.params.productId);
    if (!product) return res.status(404).json({ message: `Product: ${req.params.productId} does not exists` });
    // if (!req.userToken.admin) return res.status(403).json({ message: "Admin permission is required" });
    await deleteSingle(product._id);
    res.json(product);
  },
};
