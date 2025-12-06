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

// Đây là dòng quan trọng nhất – nhảy ra ngoài backend để lấy public
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/organizations', require('./routes/organization'));

// Trả về tochuc.html cho mọi route (để reload không bị 404)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'tochuc.html'));
});

app.listen(PORT, () => {
  console.log(`Server chạy tại port ${PORT}`);
});
