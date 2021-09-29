const {
  createProduct,
  getProducts,
  getProductById,
  getProductByName,
  updateSingle,
  deleteSingle,
} = require("../services/products");

module.exports = {
  getProducts: async (req, res) => {
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
  getProductById: async (req, res) => {
    const product = await getProductById(req.params.productId);
    if (!product) return res.status(404).json({ message: `Product: ${req.params.productId} does not exists` });
    res.json(product);
  },
  createProduct: async (req, res) => {
    const { name, price, image, type } = req.body;
    if (!name || !price) return res.status(400).json({ message: "Name or Price not found" });
    const productFound = await getProductByName(name);
    if (productFound) return res.status(403).json({ message: `Product: ${name} already exists` });
    const product = await createProduct(name, price, image, type);
    res.json(product);
  },
  putProduct: async (req, res) => {
    const product = await getProductById(req.params.productId);
    if (!product) return res.status(404).json({ message: `Product: ${req.params.productId} does not exists` });
    // if (!req.userToken.admin) return res.status(403).json({ message: "Admin permission is required" });
    const { name, price, imagen, type } = req.body;
    if (name || price || imagen || type) {
      const productUpdated = await updateSingle(product._id, req.body);
      res.json(productUpdated);
    } else {
      return res.status(400).json({ message: "Properties not found" });
    }
  },
  deleteProduct: async (req, res) => {
    const product = await getProductById(req.params.productId);
    if (!product) return res.status(404).json({ message: `Product: ${req.params.productId} does not exists` });
    // if (!req.userToken.admin) return res.status(403).json({ message: "Admin permission is required" });
    await deleteSingle(product._id);
    res.json(product);
  },
};
