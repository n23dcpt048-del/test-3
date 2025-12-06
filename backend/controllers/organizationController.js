const prisma = global.prisma;
const fs = require('fs');
const path = require('path');

exports.getAll = async (req, res) => {
  try {
    const orgs = await prisma.organization.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(orgs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, description, email, fanpage } = req.body;
    const avatar = req.file ? `/uploads/${req.file.filename}` : null;

    const org = await prisma.organization.create({
      data: { name, description, email, fanpage, avatar }
    });
    res.status(201).json(org);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, email, fanpage } = req.body;

    // Nếu có ảnh mới → xóa ảnh cũ
    if (req.file) {
      const old = await prisma.organization.findUnique({ where: { id } });
      if (old?.avatar) {
        const oldPath = path.join(__dirname, '..', old.avatar);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }

    const updated = await prisma.organization.update({
      where: { id },
      data: {
        name,
        description,
        email,
        fanpage,
        avatar: req.file ? `/uploads/${req.file.filename}` : undefined
      }
    });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const org = await prisma.organization.findUnique({ where: { id } });

    if (org?.avatar) {
      const filePath = path.join(__dirname, '..', org.avatar);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await prisma.organization.delete({ where: { id } });
    res.json({ message: 'Xóa thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};