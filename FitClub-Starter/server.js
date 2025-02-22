const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017");
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// Models
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    userType: { type: String, enum: ["member", "trainer"], default: "member" },
});

const User = mongoose.model("User", userSchema);

const memberSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String },
    membership: {
        remainingTime: { type: String },
        renewalDate: { type: String }
    },
    trainer: {
        name: { type: String },
        specialization: { type: String },
        experience: { type: String },
        email: { type: String },
        phone: { type: String },
        image: { type: String }
    }
});

const Member = mongoose.model("Member", memberSchema);

// Authentication Middleware
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "myjwtsecretkey1616");
        req.memberId = decoded.memberId;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// User Routes
app.post("/api/users/signup", async (req, res) => {
    const { username, email, password, phone, userType } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            phone,
            userType,
        });

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET || "myjwtsecretkey1616", {
            expiresIn: "1h",
        });

        res.status(201).json({ user: newUser, token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
});

app.post("/api/users/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "myjwtsecretkey1616", {
            expiresIn: "1h",
        });

        res.status(200).json({
            _id: user._id,
            username: user.username,
            userType: user.userType,
            email: user.email,
            token
        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
});

// Member Routes
app.post("/api/members/register", async (req, res) => {
    const { username, email, password, profilePic } = req.body;

    try {
        const existingMember = await Member.findOne({ email });
        if (existingMember) {
            return res.status(400).json({ message: 'Member already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newMember = new Member({
            username,
            email,
            password: hashedPassword,
            profilePic: profilePic || 'default-profile-pic-url',
            membership: {
                remainingTime: '30 days',
                renewalDate: '2025-01-01'
            },
            trainer: {
                name: 'John Fitness',
                specialization: 'Strength Training',
                experience: '8 years',
                email: 'john@fitnessgym.com',
                phone: '+1 234 567 890',
                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTn805Los39GYWKAKe-X0ViVASEhvOo8V3IUA&s'
            }
        });

        await newMember.save();

        const token = jwt.sign({ memberId: newMember._id }, process.env.JWT_SECRET || "myjwtsecretkey1616", { expiresIn: '1h' });

        res.json({ token, message: 'Registration successful', member: newMember });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.post("/api/members/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const member = await Member.findOne({ email });
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        const isMatch = await bcrypt.compare(password, member.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ memberId: member._id }, process.env.JWT_SECRET || "myjwtsecretkey1616", { expiresIn: '1h' });

        res.json({ token, message: 'Login successful', member });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.get("/api/members/me", authMiddleware, async (req, res) => {
    try {
        const member = await Member.findById(req.memberId);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }
        res.json(member);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Connect to Database and Start Server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});