const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Prisma
const { PrismaClient } = require('@prisma/client');
global.prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// QUAN TRỌNG: PHẢI TRỎ ĐÚNG VÀO public Ở GỐC PROJECT
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/organizations', require('./routes/organization'));

// Fallback: luôn trả về tochuc.html cho mọi route (để reload trang vẫn hoạt động)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tochuc.html'));
});

app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});
