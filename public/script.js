const loginForm = document.getElementById('loginForm');
const productForm = document.getElementById('productForm');
const deleteForm = document.getElementById('deleteForm');
const bgForm = document.getElementById('bgForm');
const productList = document.getElementById('productList');
const loginSection = document.getElementById('loginSection');
const mainContent = document.getElementById('mainContent');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const res = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const result = await res.json();
  if (result.success) {
    loginSection.style.display = 'none';
    mainContent.style.display = 'block';
    fetchProducts();
  } else {
    alert('Invalid credentials');
  }
});

async function fetchProducts() {
  const res = await fetch('/api/products');
  const products = await res.json();
  productList.innerHTML = '';
  products.forEach(p => {
    const item = document.createElement('div');
    item.innerHTML = `
      <strong>${p.name}</strong> — $${p.price}<br>
      <img src="${p.image}" height="100"/><br>
      ID: ${p.id}
      <hr>
    `;
    productList.appendChild(item);
  });
}

productForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const price = document.getElementById('price').value;
  const imageInput = document.getElementById('imageUpload');
  let imageUrl = '';

  if (imageInput.files.length > 0) {
    const formData = new FormData();
    formData.append('image', imageInput.files[0]);
    const uploadRes = await fetch('/upload-product-image', { method: 'POST', body: formData });
    const data = await uploadRes.json();
    imageUrl = data.filename;
  }

  await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, price, image: imageUrl })
  });

  productForm.reset();
  fetchProducts();
});

deleteForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('deleteId').value;
  await fetch(`/api/products/${id}`, { method: 'DELETE' });
  deleteForm.reset();
  fetchProducts();
});

bgForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const bgInput = document.getElementById('bgUpload');
  if (bgInput.files.length > 0) {
    const formData = new FormData();
    formData.append('bg', bgInput.files[0]);
    const res = await fetch('/upload-background', { method: 'POST', body: formData });
    const data = await res.json();
    document.body.style.backgroundImage = `url('${data.filename}')`;
  }
});