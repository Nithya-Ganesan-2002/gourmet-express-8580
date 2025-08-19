const crypto = require('crypto');

const ITERATIONS = 100000;
const KEYLEN = 64;
const DIGEST = 'sha512';

/**
 * PUBLIC_INTERFACE
 * Hash a password with a salt using PBKDF2.
 */
function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hashed = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEYLEN, DIGEST).toString('hex');
  return `${salt}:${hashed}`;
}

/**
 * PUBLIC_INTERFACE
 * Verify a plain password against a stored hash.
 */
function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const check = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEYLEN, DIGEST).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(check, 'hex'));
}

module.exports = { hashPassword, verifyPassword };
