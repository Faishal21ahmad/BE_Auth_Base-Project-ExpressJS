require('dotenv').config({ quiet: true });
const UserModel = require('../model/users');
const tokenpass = require('../model/tokenpass');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tokenGen = require('../utils/token');
const EmailService = require('../utils/email');
const hashcode = require('../utils/hash');

class AuthController {
    static async register(req, res) {
        const { name, email, password } = req.body
        console.log(req.body)

        if (!name) return res.status(400).json({ success: false, message: "Name is required" })
        if (!email) return res.status(400).json({ success: false, message: "Email is required" })
        if (!password) return res.status(400).json({ success: false, message: "Password is required" })
        if (password.length < 6) return res.status(400).json({ success: false, message: "Min password 6 characters" })

        try {
            const cekUser = await UserModel.cekUser(email);
            if (cekUser) {
                return res.status(400).json({ success: false, message: 'Email Registered' })
            }

            const hash = hashcode(password);
            await UserModel.createNewUser(name, email, hash);
            res.status(201).json({
                success: true, message: 'Register Success',
                data: {
                    'name': name,
                    'email': email,
                    'password': hash,
                }
            })
        } catch (error) {
            res.status(500).json({ success: false, message: 'Sarver Error', serverMassage: error.message })
        }
    }

    static async login(req, res) {
        const body = req.body;
        if (!body.email) return res.status(400).json({ success: false, message: "Email is required" })
        if (!body.password) return res.status(400).json({ success: false, message: "Paasword is required" })
        if (body.password.length < 6) return res.status(400).json({ success: false, message: "min password 6" })

        try {
            const user = await UserModel.getUserByEmail(body.email);
            if (!user) {
                return res.status(401).json({ success: false, message: "Invalid Email or Password" });
            } else {
                const isPasswordValid = await bcrypt.compareSync(body.password, user.password);
                if (!isPasswordValid) {
                    return res.status(401).json({ success: false, message: "Invalid Email or Password" });
                } else {
                    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET);
                    res.json({ success: true, message: 'GET users by ID success', token: token })
                }
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: "Server Error", serverMessage: error.message });
        }
    }

    static async profile(req, res) {
        try {
            const user = await UserModel.getUserById(req.user.id);
            return res.status(200).json({
                success: true,
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                }
            })
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    static async forgotPassword(req, res) {

        try {
            const email = req.body.email;
            if (!email) return res.status(400).json({ success: false, message: 'Email is Required' });

            const user = await UserModel.getUserByEmail(email);
            if (!user) return res.status(400).json({ success: false, message: 'If the email exists, a reset link has been sent' });

            const token = tokenGen.generateResetToken();
            const expiresAt = tokenGen.generateExpiryTime();
            await tokenpass.createToken(email, token, expiresAt);
            await EmailService.sendPasswordReset(email, token);

            res.json({ success: true, message: 'If the email exists, a reset link has been sent' });
        } catch (error) {
            // console.error('Forgot password error:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    static async resetPassword(req, res) {
        try {
            const { token, password, password_confrim } = req.body;
            if (!token || !password) {
                return res.status(400).json({ success: false, message: 'Token and password are required' });
            }

            if (password !== password_confrim) {
                return res.status(400).json({ success: false, message: 'Password confirmation does not match' });
            }

            if (password.length < 8) {
                return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
            }

            const resetRecord = await tokenpass.findByToken(token)
            if (!resetRecord) {
                return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
            }

            const hash = hashcode(password);
            await UserModel.updatePassword(resetRecord.email, hash);
            await tokenpass.deleteToken(token);
            await tokenpass.deleteByEmail(resetRecord.email);

            res.json({ success: true, message: 'Password has been reset successfully' });
        } catch (error) {
            // console.error('Reset password error:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    static async verifyToken(req, res) {
        try {
            const { token } = req.body;
            const resetRecord = await tokenpass.findByToken(token);
            if (!resetRecord) {
                return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
            }
            res.json({ success: true, message: 'Token is valid', email: resetRecord.email });
        } catch (error) {
            // console.error('Verify token error:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
}
module.exports = AuthController