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
        else{
            const userData = { email: email, password: password };
            const token = generateAccessToken(userData);
            const refreshToken = generateRefreshToken(userData);
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new userModel({name, email, password: hashedPassword, refreshToken: refreshToken});
            await newUser.save();

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false, // true in production (HTTPS)
                sameSite: "strict",
            });
            res.status(201).json({ message: 'User created successfully', token, userLogged: newUser.name });
        }
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
        }else{
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(403).json({ message: 'email or password is incorrect' });
            }
            const userData = { email: user.email , password: user.password };
            const token = generateAccessToken(userData);
            const refreshToken = generateRefreshToken(userData);
            
            // store refresh token (DB recommended)
            await userModel.findByIdAndUpdate(user._id, { refreshToken: refreshToken }, { new: true });
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false, // true in production (HTTPS)
                sameSite: "strict",
            });
            res.status(200).json({ message: 'Signed in successfully', token, name: user.name });
        }
    } catch (error) {
        res.status(500).json({ message: 'error signing in:' + error.message });
    }
}

const refreshToken = async (req, res) => {
   try{
        const token = req.cookies.refreshToken;

        if (!token) return res.sendStatus(401);

        jwt.verify(token, process.env.REFRESH_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);

            const newAccessToken = generateAccessToken({
                email: user.email,
                password: user.password
            });

            res.json({ accessToken: newAccessToken });
        });
   }catch(error){
        res.status(500).json({ message: 'error refreshing token:' + error.message });
   }
}


function generateAccessToken(user) {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });
}

function generateRefreshToken(user) {
  return jwt.sign(user, process.env.REFRESH_SECRET, { expiresIn: "1d" });
}

module.exports = {
    signUp,
    signIn,
    refreshToken
};