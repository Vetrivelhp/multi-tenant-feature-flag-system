const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { users, organizations } = require('../db/schema');
const { eq } = require('drizzle-orm');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

// Super admin login (static credentials from .env)
router.post('/super-admin/login', (req, res) => {
  const { email, password } = req.body;

  if (
    email !== process.env.SUPER_ADMIN_EMAIL ||
    password !== process.env.SUPER_ADMIN_PASSWORD
  ) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { role: 'superadmin', email },
    JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.json({ token });
});

// Admin signup
router.post('/admin/signup', async (req, res) => {
  const { email, password, organizationId } = req.body;

  if (!email || !password || !organizationId) {
    return res.status(400).json({ error: 'email, password and organizationId are required' });
  }

  try {
    // Check org exists
    const org = await db.select().from(organizations).where(eq(organizations.id, organizationId));
    if (org.length === 0) return res.status(404).json({ error: 'Organization not found' });

    // Check email not already taken
    const existing = await db.select().from(users).where(eq(users.email, email));
    if (existing.length > 0) return res.status(409).json({ error: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      email,
      password: hashedPassword,
      role: 'admin',
      organizationId,
    });

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin login
router.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.select().from(users).where(eq(users.email, email));
    const user = result[0];

    if (!user || user.role !== 'admin') {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, organizationId: user.organizationId },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;