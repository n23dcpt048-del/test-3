const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const { PrismaClient } = require('@prisma/client');
global.prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TẤT CẢ FILE TĨNH (HTML, CSS, JS, ảnh) ĐỀU NẰM Ở GỐC PROJECT
app.use(express.static(path.join(__dirname, '..')));     // phục vụ mọi file ở root
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// API
app.use('/api/organizations', require('./routes/organization'));

// Quan trọng: mọi request đều trả về tochuc.html (để reload không bị 404)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'tochuc.html'));
});

app.listen(PORT, () => {
  console.log(`Server chạy tại port ${PORT} – Truy cập /tochuc.html`);
});
