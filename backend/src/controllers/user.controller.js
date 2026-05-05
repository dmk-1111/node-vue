const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const signUp = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        const user = await userModel.findOne({email});
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({name, email, password: hashedPassword});
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ message: 'User created successfully', token, userLogged: newUser.name });
    } catch (error) {
        res.status(500).json({ message: 'error signing up:' + error.message });
    }
};

const signIn = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await userModel.findOne({email});
        if (!user) {
            return res.status(403).json({ message: 'email or password is incorrect' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(403).json({ message: 'email or password is incorrect' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Signed in successfully', token, name: user.name });
    } catch (error) {
        res.status(500).json({ message: 'error signing in:' + error.message });
    }
}

module.exports = {
    signUp,
    signIn
};