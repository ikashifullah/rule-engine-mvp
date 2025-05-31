const { listProducts, getProductById } = require('../data/products');

const categoryMinPrices = {
  electronics: 100,
  clothing: 20,
  books: 5
};

function validateProduct(data, existingProduct = null) {
  // Basic validation
  if (!data.name || typeof data.name !== 'string') {
    throw new Error('Product name is required and must be a string.');
  }

  if (!data.category || typeof data.category !== 'string') {
    throw new Error('Product category is required and must be a string.');
  }

  if (typeof data.price !== 'number' || data.price <= 0) {
    throw new Error('Price must be a positive number.');
  }

  const allowedStatuses = ['draft', 'active', 'archived'];
  if (data.status && !allowedStatuses.includes(data.status)) {
    throw new Error('Invalid product status.');
  }

  // --- Business Rules ---

  // 1. Status Transition
  if (existingProduct) {
    const prev = existingProduct.status;
    const next = data.status;
    if (
      prev !== next &&
      !(
        (prev === 'draft' && next === 'active') ||
        (prev === 'active' && next === 'archived') ||
        (prev === 'archived' && next === 'draft')
      )
    ) {
      throw new Error(`Invalid status transition from '${prev}' to '${next}'`);
    }
  }

  // 2. Stock Rule for Active Products
  if (data.status === 'active' && data.stock <= 0) {
    throw new Error('Cannot activate a product with 0 stock.');
  }

  // 3. Category Minimum Price
  const minPrice = categoryMinPrices[data.category];
  if (minPrice && data.price < minPrice) {
    throw new Error(`Minimum price for category '${data.category}' is $${minPrice}`);
  }

  // 4. Promotion Rule
  if (data.promotion === true) {
    if (!data.basePrice || data.basePrice <= 0) {
      throw new Error('Base price must be set for promotional products.');
    }
    const expectedPrice = data.basePrice * 0.9;
    if (data.price >= expectedPrice) {
      throw new Error('Promotional price must be at least 10% lower than base price.');
    }
  }

  // 5. Featured Products Limit
  if (data.featured === true && data.status === 'active') {
    const activeFeatured = listProducts().filter(
      p => p.featured && p.status === 'active' && (!existingProduct || p.id !== existingProduct.id)
    );
    if (activeFeatured.length >= 3) {
      throw new Error('Cannot have more than 3 active featured products.');
    }
  }
}

module.exports = {
  validateProduct
};
