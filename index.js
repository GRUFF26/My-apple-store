const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const port = process.env.PORT || 3000;

// Хранилище пользователей
const USERS_FILE = path.join(__dirname, 'users.json');
let users = fs.existsSync(USERS_FILE) ? JSON.parse(fs.readFileSync(USERS_FILE)) : [
  { username: 'admin', password: '1234' } // простой логин
];

// Хранилище продуктов
const PRODUCTS_FILE = path.join(__dirname, 'products.json');
let products = fs.existsSync(PRODUCTS_FILE) ? JSON.parse(fs.readFileSync(PRODUCTS_FILE)) : [];

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Загрузка изображений
const uploadProductImage = multer({ dest: 'public/uploads/' });
app.post('/upload-product-image', uploadProductImage.single('image'), (req, res) => {
  res.json({ filename: `/uploads/${req.file.filename}` });
});

const uploadBg = multer({ dest: 'public/background/' });
app.post('/upload-background', uploadBg.single('bg'), (req, res) => {
  res.json({ filename: `/background/${req.file.filename}` });
});

// Авторизация
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const valid = users.find(u => u.username === username && u.password === password);
  res.json({ success: !!valid });
});

// Продукты
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/products', (req, res) => {
  const { name, price, image } = req.body;
  const id = Date.now();
  const product = { id, name, price, image };
  products.push(product);
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
  res.json({ success: true, product });
});

app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  products = products.filter(p => p.id !== id);
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});