const crypto = require('crypto');
// Generate a random secret key for session configuration :)
const secretKey = crypto.randomBytes(32).toString('hex');
console.log('Secret Key:', secretKey);


