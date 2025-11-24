const UserModel = require('../model/users');
const hashcode = require('../utils/hash');

class UserController {
    static async getAllUsers(req, res) {
        try {
            const data = await UserModel.getAllUsers();
            res.json({ success: true, message: 'GET users success', data: data })
        } catch (error) {
            res.status(500).json({ success: false, message: 'Sarver Error', serverMassage: error })
        }
    }
    static async getUserById(req, res) {
        const { id } = req.params;
        const data = await UserModel.getUserById(id);
        if (!data[0]) return res.status(400).json({ success: false, message: 'user not found' });

        try {
            res.json({ success: true, message: 'GET users by ID success', data: data })
        } catch (error) {
            res.status(500).json({ success: false, message: 'Sarver Error', serverMassage: error })
        }
    }
    static async createNewUser(req, res) {
        const { email, name, password } = req.body;

        if (!email || !name || !password) {
            return res.status(400).json({ success: false, message: 'You sent wrong data', data: null })
        }

        const cekUser = await UserModel.cekUser(email);
        if (cekUser) {
            return res.status(400).json({ success: false, message: 'Email Registered' })
        }

        try {
            const hash = hashcode(password);

            await UserModel.createNewUser(name, email, hash)
            res.status(201).json({
                success: true, message: 'Create new users success',
                data: [{
                    'name': name,
                    'email': email,
                    'password': hash,
                }]
            })
        } catch (error) {
            res.status(500).json({ success: false, message: 'Sarver Error', serverMassage: error.message })
        }
    }
    static async updateUser(req, res) {
        const { id } = req.params;
        const { name, email, password } = req.body;

        const hash = hashcode(password);
        try {
            await UserModel.updateUser(name, email, hash, id);
            res.json({
                success: true, message: 'UPDATE user success',
                data: {
                    id: id,
                    name: name,
                    email: email,
                    password: hash
                },
            })
        } catch (error) {
            res.status(500).json({ success: false, message: 'Sarver Error', serverMassage: error.message })
        }
    }
    static async deleteUser(req, res) {
        const { id } = req.params;
        try {
            await UserModel.deleteUser(id)
            res.json({ success: true, message: 'DELETE user success', data: null })
        } catch (error) {
            res.status(500).json({ success: false, message: 'Sarver Error', serverMassage: error })
        }
    }
}

module.exports = UserController;