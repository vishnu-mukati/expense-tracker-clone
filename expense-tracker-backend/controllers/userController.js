const { User } = require('../models/index');  // Destructure to get User model directly
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateAccessToken = (id) =>{
    return jwt.sign({userId : id},'sdiwjiei493ifgrek0efgjgef234jejgejgfjf90r943ijfgej349590egijffg9492r29jegjdjfgj9tj0934rjtffij')
}


const UserSignUp = async (req, res) => {
    const { name, email, password, premiumUser } = req.body;
    console.log('primium user value:', premiumUser);

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }
        const hash = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hash,
            premiumUser
        });
        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
};

const UserLogin = async (req, res) => {
 const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email,  } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.status(200).json({success : true, message: 'Login successful', token : generateAccessToken(user.id), premiumUser: user.premiumUser });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};

module.exports = {
    UserSignUp,
    UserLogin
};
