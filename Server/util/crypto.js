const crypto = require('crypto')
function generateToken(length) {
    return crypto.randomBytes(length).toString('hex');
}

module.exports = {
    generateToken
}