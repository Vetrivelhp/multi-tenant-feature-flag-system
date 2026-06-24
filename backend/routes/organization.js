const express = require('express');
const db = require('../db');
const { organizations } = require('../db/schema');
const { eq } = require('drizzle-orm');
const { isSuperAdmin } = require('../middleware/auth');

const router = express.Router();

// Create org - super admin only
router.post('/create', isSuperAdmin, async (req, res) => {
  const { name } = req.body;

  if (!name) return res.status(400).json({ error: 'Organization name is required' });

  try {
    await db.insert(organizations).values({ name });
    res.status(201).json({ message: 'Organization created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List all orgs - super admin only
router.get('/list', isSuperAdmin, async (req, res) => {
  try {
    const allOrgs = await db.select().from(organizations);
    res.json(allOrgs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Public route - no auth needed
router.get('/list/public', async (req, res) => {
  try {
    const allOrgs = await db.select().from(organizations);
    res.json(allOrgs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;