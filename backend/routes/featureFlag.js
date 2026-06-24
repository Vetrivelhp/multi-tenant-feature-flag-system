const express = require('express');
const db = require('../db');
const { featureFlags } = require('../db/schema');
const { eq, and } = require('drizzle-orm');
const { isAdmin, verifyToken } = require('../middleware/auth');

const router = express.Router();

// Create flag - admin only
router.post('/create', isAdmin, async (req, res) => {
  const { featureKey, enabled } = req.body;
  const organizationId = req.user.organizationId;

  if (!featureKey) return res.status(400).json({ error: 'featureKey is required' });

  try {
    // Check for duplicate key in same org
    const existing = await db.select().from(featureFlags)
      .where(and(
        eq(featureFlags.featureKey, featureKey),
        eq(featureFlags.organizationId, organizationId)
      ));

    if (existing.length > 0) return res.status(409).json({ error: 'Feature key already exists' });

    await db.insert(featureFlags).values({
      featureKey,
      enabled: enabled ?? false,
      organizationId,
    });

    res.status(201).json({ message: 'Feature flag created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List all flags for admin's org - admin only
router.get('/list', isAdmin, async (req, res) => {
  const organizationId = req.user.organizationId;

  try {
    const flags = await db.select().from(featureFlags)
      .where(eq(featureFlags.organizationId, organizationId));
    res.json(flags);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update flag - admin only
router.put('/update/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  const { enabled } = req.body;
  const organizationId = req.user.organizationId;

  try {
    // Make sure flag belongs to admin's org
    const flag = await db.select().from(featureFlags)
      .where(and(
        eq(featureFlags.id, parseInt(id)),
        eq(featureFlags.organizationId, organizationId)
      ));

    if (flag.length === 0) return res.status(404).json({ error: 'Flag not found' });

    await db.update(featureFlags)
      .set({ enabled })
      .where(eq(featureFlags.id, parseInt(id)));

    res.json({ message: 'Flag updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete flag - admin only
router.delete('/delete/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  const organizationId = req.user.organizationId;

  try {
    const flag = await db.select().from(featureFlags)
      .where(and(
        eq(featureFlags.id, parseInt(id)),
        eq(featureFlags.organizationId, organizationId)
      ));

    if (flag.length === 0) return res.status(404).json({ error: 'Flag not found' });

    await db.delete(featureFlags).where(eq(featureFlags.id, parseInt(id)));
    res.json({ message: 'Flag deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Check if a feature is enabled - any logged in user
router.get('/check/:featureKey', verifyToken, async (req, res) => {
  const { featureKey } = req.params;
  const organizationId = req.user.organizationId;

  try {
    const flag = await db.select().from(featureFlags)
      .where(and(
        eq(featureFlags.featureKey, featureKey),
        eq(featureFlags.organizationId, organizationId)
      ));

    if (flag.length === 0) return res.status(404).json({ error: 'Feature not found' });

    res.json({ featureKey, enabled: flag[0].enabled });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Public - list flags for an org (no auth)
router.get('/list/public/:orgId', async (req, res) => {
  const { orgId } = req.params;
  try {
    const flags = await db.select().from(featureFlags)
      .where(eq(featureFlags.organizationId, parseInt(orgId)));
    res.json(flags);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Public - check a specific flag for an org (no auth)
router.get('/check/public/:orgId/:featureKey', async (req, res) => {
  const { orgId, featureKey } = req.params;
  try {
    const flag = await db.select().from(featureFlags)
      .where(and(
        eq(featureFlags.featureKey, featureKey),
        eq(featureFlags.organizationId, parseInt(orgId))
      ));

    if (flag.length === 0) return res.status(404).json({ error: 'Feature not found' });

    res.json({ featureKey, enabled: flag[0].enabled });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;