const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const { PrismaClient } = require('@prisma/client');
global.prisma = new PrismaClient();

// CORS MẠNH NHẤT – CHẠY 100% VỚI GITHUB PAGES
app.use(cors({
  origin: "*",
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// File tĩnh
app.use(express.static(path.join(__dirname, '..')));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// API CHẮC CHẮN PHẢI CÓ DÒNG NÀY
app.use('/api/organizations', require('./routes/organization'));

// Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'tochuc.html'));
});

app.listen(PORT, () => console.log(`Backend chạy: https://test-3-1trd.onrender.com`));
