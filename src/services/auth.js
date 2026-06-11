const crypto = require('crypto');

/**
 * Utility to hash passwords using native Node.js scrypt.
 * @param {string} password - The password to hash.
 * @returns {Promise<string>} - The hashed password with salt (format: salt:hash).
 */
async function hashPassword(password)
{
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = await new Promise((resolve, reject) =>
    {
        crypto.scrypt(password, salt, 64, (err, derivedKey) =>
        {
            if(err) reject(err);
            resolve(derivedKey.toString('hex'));
        });
    });
    return `${salt}:${hash}`;
}

/**
 * Utility to verify a password against a stored hash.
 * @param {string} password - The password to verify.
 * @param {string} storedHash - The stored salt:hash string.
 * @returns {Promise<boolean>} - True if match, false otherwise.
 */
async function verifyPassword(password, storedHash)
{
    const [salt, hash] = storedHash.split(':');
    const derivedKey = await new Promise((resolve, reject) =>
    {
        crypto.scrypt(password, salt, 64, (err, derivedKey) =>
        {
            if(err) reject(err);
            resolve(derivedKey.toString('hex'));
        });
    });
    return derivedKey === hash;
}

module.exports = {
    hashPassword,
    verifyPassword
};
