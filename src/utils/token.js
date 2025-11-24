const crypto = require('crypto');

class TokenGenerator {
    static generateResetToken() {
        return crypto.randomBytes(32).toString('hex');
    }

    static generateExpiryTime(hours = 1) {
        const expiry = new Date();
        expiry.setHours(expiry.getHours() + hours);
        return expiry;
    }
}

module.exports = TokenGenerator;