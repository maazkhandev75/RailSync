const crypto = require('crypto');

// Generate a random secret key
const secretKey = crypto.randomBytes(32).toString('hex');
console.log('Secret Key:', secretKey);


//output: 053eb1bb21545cd881a8e15b6fab7e58be948187fddd5babd64dd2c5e77614b7