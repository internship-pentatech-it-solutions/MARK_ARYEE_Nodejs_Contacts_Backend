require('dotenv').config();
const bcrypt = require('bcryptjs');
const CON = require('../models/userModel');
const jwt = require('jsonwebtoken');


const register = async (req, res)=>{
	try {
        const { username, email, password } = req.body;

        // Check if email already exists
        const existingUser = await CON.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const newUser = new CON({ username, email, password });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
const login = async (req, res)=>{
	try {
        const { email, password } = req.body;

        const user = await CON.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h'});
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
const logout = async (req, res)=>{
	res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
};

module.exports = { register, login, logout};


