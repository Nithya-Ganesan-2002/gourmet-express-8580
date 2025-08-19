const jwt = require('jsonwebtoken');

/**
 * PUBLIC_INTERFACE
 * Express middleware to verify JWT and attach user info to req.user.
 */
function auth(required = true) {
  return (req, res, next) => {
    try {
      const header = req.headers['authorization'] || '';
      const token = header.startsWith('Bearer ') ? header.slice(7) : null;
      if (!token) {
        if (!required) return next();
        return res.status(401).json({ status: 'error', message: 'Authorization token missing' });
      }
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_change_in_env');
      req.user = { id: payload.sub, role: payload.role, email: payload.email };
      next();
    } catch (err) {
      return res.status(401).json({ status: 'error', message: 'Invalid or expired token' });
    }
  };
}

module.exports = auth;
