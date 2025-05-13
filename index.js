const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Хранилище товаров
const PRODUCTS_FILE = path.join(__dirname, 'products.json');
let products = fs.existsSync(PRODUCTS_FILE)
  ? JSON.parse(fs.readFileSync(PRODUCTS_FILE))
  : [];

// Загрузка изображений товаров
const uploadProductImage = multer({ dest: 'public/uploads/' });
app.post('/upload-product-image', uploadProductImage.single('image'), (req, res) => {
  res.json({ filename: `/uploads/${req.file.filename}` });
});

// Загрузка фонового изображения
const uploadBg = multer({ dest: 'public/background/' });
app.post('/upload-background', uploadBg.single('bg'), (req, res) => {
  res.json({ filename: `/background/${req.file.filename}` });
});

// API: получить все продукты
app.get('/api/products', (req, res) => {
  res.json(products);
});

// API: добавить продукт
app.post('/api/products', (req, res) => {
  const { name, price, image } = req.body;
  const id = Date.now();
  const product = { id, name, price, image };
  products.push(product);
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
  res.json({ success: true, product });
});

// API: удалить продукт
app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  products = products.filter(p => p.id !== id);
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
