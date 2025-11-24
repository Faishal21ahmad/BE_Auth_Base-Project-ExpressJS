const jwt = require('jsonwebtoken');
const UserModel = require('../model/users');
require('dotenv').config({ quiet: true });

async function authN(req, res, next) {
    try {
        const token = req.headers.authorization;
        if (!token) res.status(401).json({ success: false, message: "unautorized" });

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.getUserById(payload.id);

        if (!user) res.status(401).json({ success: false, message: "unautorized" });
        req.user = user;
        next()
    } catch (error) {
        res.status(401).json({ success: false, message: "unauthorized" })
    }
}

module.exports = authN;