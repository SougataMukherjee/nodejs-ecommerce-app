const productService = require(
  "../services/productService"
);

exports.getProducts = async (req, res) => {
  const products =
    await productService.getProducts(req.query);

  res.json(products);
};

exports.getProduct = async (req, res) => {
  const product =
    await productService.getProduct(
      req.params.id
    );

  res.json(product);
};

exports.createProduct = async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.status(201).json(product);
};

exports.deleteProduct = async (req, res) => {
  const result = await productService.deleteProduct(req.params.id);
  res.json(result);
};