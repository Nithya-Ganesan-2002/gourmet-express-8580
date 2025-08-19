const jwt = require('jsonwebtoken');

/**
 * PUBLIC_INTERFACE
 * Issue a JWT for a user.
 */
function issueToken(user) {
  const payload = { sub: user.id, role: user.role, email: user.email };
  const secret = process.env.JWT_SECRET || 'dev_secret_change_in_env';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(payload, secret, { expiresIn });
}

module.exports = { issueToken };
