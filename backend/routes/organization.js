const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const orgController = require('../controllers/organizationController');

// Cấu hình upload ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'org-' + unique + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb(new Error('Chỉ chấp nhận ảnh!'));
  }
});

router.get('/', orgController.getAll);
router.post('/', upload.single('avatar'), orgController.create);
router.put('/:id', upload.single('avatar'), orgController.update);
router.delete('/:id', orgController.delete);

module.exports = router;