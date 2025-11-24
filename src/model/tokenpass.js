const dbPool = require('../config/database');

class tokenpass {
    static async createToken(email, token, expiresAt) {
        // Delete existing tokens for this email
        await dbPool.execute('DELETE FROM token_reset WHERE email = ?', [email]);

        // Insert new token
        await dbPool.execute(
            'INSERT INTO token_reset (email, token, expires_at) VALUES (?, ?, ?)',
            [email, token, expiresAt]
        );
    }

    static async findByToken(token) {
        const [rows] = await dbPool.execute(
            'SELECT * FROM token_reset WHERE token = ? AND expires_at > NOW()',
            [token]
        );
        return rows[0];
    }

    static async deleteToken(token) {
        await dbPool.execute('DELETE FROM token_reset WHERE token = ?', [token]);
    }

    static async deleteByEmail(email) {
        await dbPool.execute('DELETE FROM token_reset WHERE email = ?', [email]);
    }
}

module.exports = tokenpass
