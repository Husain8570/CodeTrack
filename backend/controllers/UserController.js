const express = require('express');
const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const auth = require('../middleware/authentication.js');

dotenv.config();

const jwt_secret = process.env.JWT_SECRET;

// 🔹 LOGIN FUNCTION (Returns Token in Response)
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                msg: "All fields are required",
            });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({
                success: false,
                msg: "Incorrect Credentials",
            });
        }

        const result = await bcrypt.compare(password, user.password);
        if (result) {
            const token = jwt.sign({ username }, jwt_secret, {
                expiresIn: '1d'
            });

            return res.status(200).json({
                success: true,
                msg: "Login successful",
                token // 🔹 Sending token in response instead of setting a cookie
            });
        } else {
            return res.status(400).json({
                success: false,
                msg: "Incorrect Credentials",
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Server error",
        });
    }
};

// 🔹 SIGNUP FUNCTION (Returns Token in Response)
const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                msg: "All fields are required",
            });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                msg: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            username,
            email,
            password: hashedPassword,
        });

        const token = jwt.sign({ username }, jwt_secret, {
            expiresIn: '1d'
        });

        return res.status(201).json({
            success: true,
            msg: "Signup successful",
            token // 🔹 Sending token in response instead of setting a cookie
        });

    } catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).json({
            success: false,
            msg: "Internal server error",
        });
    }
};

// 🔹 LOGOUT FUNCTION (Frontend will remove token from `localStorage`)
const logout = (req, res) => {
    try {
        return res.json({
            success: true,
            msg: "Logout successful"
        });
    } catch {
        return res.json({
            success: false,
            msg: "Server error"
        });
    }
};

// 🔹 AUTHENTICATION VERIFICATION FUNCTION
const authenticate = (req, res) => {
    res.status(200).json({
        success: true,
        msg: "User is authenticated"
    });
};

// 🔹 PROTECTED USER ROUTE (Extract Token from Header)
const user = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // 🔹 Get Token from Header

        if (!token) {
            return res.status(401).json({
                success: false,
                msg: "Unauthorized: No token provided",
            });
        }

        const decoded = jwt.verify(token, jwt_secret);
        const user = await User.findOne({ username: decoded.username }).populate('problems');

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: "Invalid Token or Server Error"
        });
    }
};

module.exports = { login, signup, logout, authenticate, user };
