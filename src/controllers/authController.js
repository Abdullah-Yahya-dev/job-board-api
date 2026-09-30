const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Jwt = require('../config/config');

const createUser = async (req, res, next) => {
    try {
        console.log("Creating user with data:", req.body);
        const user = await User.create(req.body);
        const token = jwt.sign({ id: user._id, role: user.role }, Jwt.jwt.secret, { expiresIn: Jwt.jwt.expiresIn });
        res.status(201).json({ user: { id: user._id, email: user.email, role: user.role }, token });
    } catch (error) {
        next(error);
    }
};  


const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, Jwt.jwt.secret, { expiresIn: Jwt.jwt.expiresIn });
        const refreshToken = jwt.sign({ id: user._id, role: user.role }, Jwt.jwt.refreshSecret, { expiresIn: Jwt.jwt.refreshExpiresIn });
        user.refreshToken = refreshToken;
        await user.save();
        res.json({ user: { id: user._id, email: user.email, role: user.role }, token, refreshToken, message: 'Login successful' });

    } catch (error) {
        next(error);
    }
};

const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ error: 'Refresh token is required' });
        }

        const decoded = jwt.verify(refreshToken, Jwt.jwt.refreshSecret);
        const user = await User.findById(decoded.id);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ error: 'Invalid refresh token' });
        }

        const newToken = jwt.sign({ id: user._id, role: user.role }, Jwt.jwt.secret, { expiresIn: Jwt.jwt.expiresIn });
        const newRefreshToken = jwt.sign({ id: user._id, role: user.role }, Jwt.jwt.refreshSecret, { expiresIn: Jwt.jwt.refreshExpiresIn });
        user.refreshToken = newRefreshToken;
        await user.save();
        res.json({ token: newToken, refreshToken: newRefreshToken });
    } catch (error) {
        next(error);
    }
}

const logoutUser = async (req, res, next) => {
        try {
            const userId = req.user.id;
            const user = await User.findByIdAndUpdate(userId, { refreshToken: null }, { new: true });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({ message: 'Logged out successfully' });
        } catch (error) {
            next(error);
        }
    };


module.exports = {
    createUser,
    loginUser,
    refreshToken,
    logoutUser
};
