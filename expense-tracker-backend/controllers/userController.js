const User = require('../models/user');
const bcrypt = require('bcrypt');

const UserSignUp = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }
        const hash = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hash 
        });
        res.status(201).json({message: "User created successfully",user});
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
};



const UserLogin = async (req, res) => {
 const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};

module.exports = {
    UserSignUp,
    UserLogin
};
