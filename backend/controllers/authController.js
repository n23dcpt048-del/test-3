const jwt = require('jsonwebtoken');
const db = require('../utils/db');

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ email và mật khẩu' });
  }

  const admin = db.get('admins').find({ email, password }).value();

  if (!admin) {
    return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
  }

  const token = jwt.sign(
    { id: admin.id, email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    success: true,
    message: 'Đăng nhập thành công',
    token,
    user: { email: admin.email }
  });
};

const verifyToken = (req, res) => {
  res.json({ success: true, user: req.user });
};

module.exports = { login, verifyToken };