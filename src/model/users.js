const dbPool = require('../config/database');

class userModel {
    static async getAllUsers() {
        const SQLQuery = 'SELECT * FROM users';
        const [data] = await dbPool.execute(SQLQuery);
        return data;
    }

    static async getUserById(id) {
        const SQLQuery = `SELECT * FROM users WHERE id=?`;
        const [[data]] = await dbPool.execute(SQLQuery, [id]);
        return data;
    }

    static async getUserByEmail(email) {
        const SQLQuery = `SELECT * FROM users WHERE email=?`;
        const [[data]] = await dbPool.execute(SQLQuery, [email]);
        return data;
    }

    static async createNewUser(name, email, password) {
        const SQLQuery = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
        const [data] = await dbPool.execute(SQLQuery, [name, email, password]);
        return data;
    }

    static async cekUser(email) {
        const SQLQuery = `SELECT * FROM users WHERE email = ?`;
        const [data] = await dbPool.execute(SQLQuery, [email]);
        return data.length > 0;
    }

    static async updatePassword(email, password) {
        const SQLQuery = `UPDATE users SET password = ? WHERE email = ?`;
        const [data] = await dbPool.execute(SQLQuery, [password, email]);
        return data;
    }

    static async updateUser(name, email, password, id) {
        const SQLQuery = `UPDATE users SET name=?, email=?, password=? WHERE id=?`;
        await dbPool.execute(SQLQuery, [name, email, password, id]);
        return;
    }

    static async deleteUser(id) {
        const SQLQuery = `DELETE FROM users WHERE id=?`;
        await dbPool.execute(SQLQuery, [id]);
        return;
    }

}

module.exports = userModel 