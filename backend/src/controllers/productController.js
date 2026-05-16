const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const whereClause = category && category !== 'Todos' ? { category } : {};
    
    const products = await Product.findAll({ where: whereClause });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};
