const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key';

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, email, role, organizationId }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function isSuperAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ error: 'Super admin access only' });
    }
    next();
  });
}

function isAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access only' });
    }
    next();
  });
}

function isUser(req, res, next) {
  verifyToken(req, res, () => {
    if (!req.user) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  });
}

module.exports = { verifyToken, isSuperAdmin, isAdmin, isUser };