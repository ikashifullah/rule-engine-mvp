const { v4: uuidv4 } = require('uuid');

const products = [];

function createProduct(data) {
  const product = {
    id: uuidv4(),
    name: data.name,
    category: data.category,
    price: data.price,
    stock: data.stock || 0,
    status: 'draft', // default status
    createdAt: new Date(),
    updatedAt: new Date()
  };
  products.push(product);
  return product;
}

function getProductById(id) {
  return products.find(product => product.id === id);
}

function updateProduct(id, data) {
  const product = getProductById(id);
  if (!product) return null;

  Object.assign(product, data, { updatedAt: new Date() });
  return product;
}

function deleteProduct(id) {
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return false;
  products.splice(index, 1);
  return true;
}

function listProducts() {
  return products;
}

module.exports = {
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  listProducts
};