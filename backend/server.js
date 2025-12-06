const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Prisma
const { PrismaClient } = require('@prisma/client');
global.prisma = new PrismaClient();

// ==================== SIÊU QUAN TRỌNG: BẬT CORS CHO GITHUB PAGES ====================
app.use(cors()); // cách cũ chỉ cho phép một số domain

// THAY BẰNG CÁCH MỚI – CHO PHÉP TẤT CẢ DOMAIN GỌI API (bao gồm *.github.io)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');                    // cho phép mọi nơi gọi
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Xử lý preflight request
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});
// ====================================================================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Phục vụ file tĩnh ở root (HTML, CSS, JS, picture, script, style...)
app.use(express.static(path.join(__dirname, '..')));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// API routes
app.use('/api/organizations', require('./routes/organization'));
// thêm các route khác ở đây sau này: events, seo, social...

// Fallback: mọi đường dẫn đều mở tochuc.html (để reload trang không bị 404)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'tochuc.html'));
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại port ${PORT}`);
  console.log(`Frontend: https://your-username.github.io/your-repo/`);
  console.log(`Backend API: https://test-3-1trd.onrender.com/api/organizations`);
});
