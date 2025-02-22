const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Signup
const signup = async (req, res) => {
    const { username, email, password, phone, userType } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            phone,
            userType,
        });

        // Generate JWT
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.status(201).json({ user: newUser, token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

// Login
const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ username });
        console.log(user);

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare passwords
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.status(200).json({
            _id: user._id,
            username: user.username, userType: user.userType,
            email: user.email,
            profilePic: user.profilePic, token
        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

module.exports = { signup, login };