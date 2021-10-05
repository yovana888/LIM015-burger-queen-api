const {
  createProduct,
  getProducts,
  getProductById,
  updateSingle,
  deleteSingle,
} = require('../services/products');
require('../middleware/auth');
const { convertToLinks } = require('../utils/util');

module.exports = {
  getProducts: async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const { host } = req.headers;
    const totalPages = Math.ceil((await getProducts(1, 0)).length / limit);
    const products = await getProducts(Number(page), Number(limit));
    const link = convertToLinks(host, 'products', limit, page, totalPages);
    res.set('Link', JSON.stringify(link));
    return res.json(products);
  },
  getProductById: async (req, res) => {
    const product = await getProductById(req.params.productId);
    if (!product) return res.status(404).json({ message: `Product: ${req.params.productId} does not exists` });
    return res.json(product);
  },
  createProduct: async (req, res) => {
    const {
      name, price, image, type,
    } = req.body;
    if (!name || !price) return res.status(400).json({ message: 'Name or Price is missing' });
    if (price && typeof price !== 'number') return res.status(400).json({ message: 'typeof of price is not a number' });
    const product = await createProduct(name, price, image, type);
    return res.json(product);
  },
  putProduct: async (req, res) => {
    const product = await getProductById(req.params.productId);
    if (!product) return res.status(404).json({ message: `Product: ${req.params.productId} does not exists` });
    const {
      name, price, image, type,
    } = req.body;
    if (name || price || image || type) {
      if (price && typeof price !== 'number') return res.status(400).json({ message: 'typeof of price is not a number' });
      const productUpdated = await updateSingle(product._id, req.body);
      return res.json(productUpdated);
    }
    return res.status(400).json({ message: 'Properties not found' });
  },
  deleteProduct: async (req, res) => {
    const product = await getProductById(req.params.productId);
    if (!product) return res.status(404).json({ message: `Product: ${req.params.productId} does not exists` });
    await deleteSingle(product._id);
    return res.json(product);
  },
};
