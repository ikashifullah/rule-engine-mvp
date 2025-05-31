const express = require('express');
const bodyParser = require('body-parser');
const productStore = require('./data/products');
const { validateProduct } = require('./services/rules');


const app = express();
app.use(bodyParser.json());
const port = 3000;


app.post('/products', (req, res) => {
  try {
    validateProduct(req.body);
    const product = productStore.createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ
app.get('/products/:id', (req, res) => {
  const product = productStore.getProductById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Not found' });
  res.json(product);
});

// UPDATE
app.put('/products/:id', (req, res) => {
  const existing = productStore.getProductById(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Not found' });

  try {
    validateProduct(req.body, existing);
    const updated = productStore.updateProduct(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// DELETE
app.delete('/products/:id', (req, res) => {
  const deleted = productStore.deleteProduct(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true });
});

// LIST
app.get('/products', (req, res) => {
  res.json(productStore.listProducts());
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

