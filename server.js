const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Razorpay = require('razorpay');
const crypto = require('crypto');

dotenv.config();

const app = express();

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_ID ,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/public', express.static('public'));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = './public/trainer/photos';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// MongoDB Connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/fitclub");
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
    phone: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    emergencyContact: { type: String, required: true },
    healthConditions: { type: String },
    userType: { type: String, default: "member" },
    membership: {
        type: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        status: { type: String, default: "inactive" }
    },
    assignedTrainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer' }
});

const Member = mongoose.model("Member", memberSchema);

const workoutPlanSchema = new mongoose.Schema({
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
    weeklyPlan: [{
        day: { type: String, required: true },
        exercises: [{
            name: { type: String, required: true },
            sets: { type: Number, required: true },
            reps: { type: Number, required: true },
            duration: { type: Number }, // in minutes
            notes: { type: String }
        }]
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const WorkoutPlan = mongoose.model("WorkoutPlan", workoutPlanSchema);

const dietPlanSchema = new mongoose.Schema({
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
    weeklyPlan: [{
        day: { type: String, required: true },
        meals: [{
            type: { type: String, required: true }, // breakfast, lunch, dinner, snack
            foods: [{
                name: { type: String, required: true },
                quantity: { type: String, required: true },
                calories: { type: Number }
            }]
        }]
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const DietPlan = mongoose.model("DietPlan", dietPlanSchema);

const trainerSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    phone: { type: String, required: true },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
    certification: { type: String, required: true },
    feePerMonth: { type: Number, required: true },
    availability: { type: String, required: true },
    photo: { type: String, required: true },
    userType: { type: String, default: "trainer" },
    clients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }],
    rating: { type: Number, default: 0 },
    reviews: [{
        memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
        rating: Number,
        comment: String,
        date: { type: Date, default: Date.now }
    }]
});

const Trainer = mongoose.model("Trainer", trainerSchema);

const eventSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    date: { type: Date, required: true }
});

const Event = mongoose.model("Event", eventSchema);

// Coupon Schema
const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    discount: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

const Coupon = mongoose.model("Coupon", couponSchema);

// Authentication Middleware
const authMiddleware = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "myjwtsecretkey1616");
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Admin Authentication Middleware
const adminAuthMiddleware = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        // For simplicity, we're using a hardcoded token check
        // In a real app, you would verify a proper JWT token
        if (token !== 'admin-jwt-token') {
            return res.status(401).json({ message: 'Invalid admin token' });
        }
        
        req.admin = { isAdmin: true };
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Role-based Authorization Middleware
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.userType)) {
            return res.status(403).json({ 
                message: 'Access denied. You do not have permission to access this resource.' 
            });
        }
        next();
    };
};

// Admin Routes
app.get("/api/admin/members", adminAuthMiddleware, async (req, res) => {
    try {
        const members = await Member.find().select('-password');
        res.json(members);
    } catch (error) {
        console.error("Error fetching members:", error);
        res.status(500).json({ message: "Error fetching members" });
    }
});

app.get("/api/admin/trainers", adminAuthMiddleware, async (req, res) => {
    try {
        const trainers = await Trainer.find().select('-password');
        res.json(trainers);
    } catch (error) {
        console.error("Error fetching trainers:", error);
        res.status(500).json({ message: "Error fetching trainers" });
    }
});

app.put("/api/admin/members/:id", adminAuthMiddleware, async (req, res) => {
    try {
        const { username, email, phone, age, gender } = req.body;
        
        const member = await Member.findByIdAndUpdate(
            req.params.id,
            { username, email, phone, age, gender },
            { new: true }
        ).select('-password');
        
        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }
        
        res.json(member);
    } catch (error) {
        console.error("Error updating member:", error);
        res.status(500).json({ message: "Error updating member" });
    }
});

app.put("/api/admin/trainers/:id", adminAuthMiddleware, async (req, res) => {
    try {
        const { username, email, fullName, phone, specialization, experience, feePerMonth } = req.body;
        
        const trainer = await Trainer.findByIdAndUpdate(
            req.params.id,
            { username, email, fullName, phone, specialization, experience, feePerMonth },
            { new: true }
        ).select('-password');
        
        if (!trainer) {
            return res.status(404).json({ message: "Trainer not found" });
        }
        
        res.json(trainer);
    } catch (error) {
        console.error("Error updating trainer:", error);
        res.status(500).json({ message: "Error updating trainer" });
    }
});

app.delete("/api/admin/members/:id", adminAuthMiddleware, async (req, res) => {
    try {
        const member = await Member.findByIdAndDelete(req.params.id);
        
        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }
        
        res.json({ message: "Member deleted successfully" });
    } catch (error) {
        console.error("Error deleting member:", error);
        res.status(500).json({ message: "Error deleting member" });
    }
});

app.delete("/api/admin/trainers/:id", adminAuthMiddleware, async (req, res) => {
    try {
        const trainer = await Trainer.findByIdAndDelete(req.params.id);
        
        if (!trainer) {
            return res.status(404).json({ message: "Trainer not found" });
        }
        
        res.json({ message: "Trainer deleted successfully" });
    } catch (error) {
        console.error("Error deleting trainer:", error);
        res.status(500).json({ message: "Error deleting trainer" });
    }
});

// Coupon Routes
app.get("/api/admin/coupons", adminAuthMiddleware, async (req, res) => {
    try {
        const coupons = await Coupon.find();
        res.json(coupons);
    } catch (error) {
        console.error("Error fetching coupons:", error);
        res.status(500).json({ message: "Error fetching coupons" });
    }
});

app.post("/api/admin/coupons", adminAuthMiddleware, async (req, res) => {
    try {
        const { code, discount, expiryDate, isActive } = req.body;
        
        const existingCoupon = await Coupon.findOne({ code });
        if (existingCoupon) {
            return res.status(400).json({ message: "Coupon code already exists" });
        }
        
        const newCoupon = new Coupon({
            code,
            discount,
            expiryDate,
            isActive
        });
        
        await newCoupon.save();
        res.status(201).json(newCoupon);
    } catch (error) {
        console.error("Error creating coupon:", error);
        res.status(500).json({ message: "Error creating coupon" });
    }
});

app.put("/api/admin/coupons/:id", adminAuthMiddleware, async (req, res) => {
    try {
        const { code, discount, expiryDate, isActive } = req.body;
        
        // Check if updated code already exists (excluding the current coupon)
        const existingCoupon = await Coupon.findOne({ 
            code, 
            _id: { $ne: req.params.id } 
        });
        
        if (existingCoupon) {
            return res.status(400).json({ message: "Coupon code already exists" });
        }
        
        const coupon = await Coupon.findByIdAndUpdate(
            req.params.id,
            { code, discount, expiryDate, isActive },
            { new: true }
        );
        
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }
        
        res.json(coupon);
    } catch (error) {
        console.error("Error updating coupon:", error);
        res.status(500).json({ message: "Error updating coupon" });
    }
});

app.delete("/api/admin/coupons/:id", adminAuthMiddleware, async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }
        
        res.json({ message: "Coupon deleted successfully" });
    } catch (error) {
        console.error("Error deleting coupon:", error);
        res.status(500).json({ message: "Error deleting coupon" });
    }
});

// Validate Coupon Route (for members)
app.post("/api/coupons/validate", authMiddleware, async (req, res) => {
    try {
        const { code } = req.body;
        
        const coupon = await Coupon.findOne({ 
            code, 
            isActive: true,
            expiryDate: { $gt: new Date() }
        });
        
        if (!coupon) {
            return res.status(404).json({ message: "Invalid or expired coupon" });
        }
        
        res.json({
            code: coupon.code,
            discount: coupon.discount,
            expiryDate: coupon.expiryDate
        });
    } catch (error) {
        console.error("Error validating coupon:", error);
        res.status(500).json({ message: "Error validating coupon" });
    }
});

// Trainer Selection Routes
app.post("/api/members/select-trainer", authMiddleware, authorize("member"), async (req, res) => {
    try {
        const { trainerId } = req.body;
        const memberId = req.user.id;

        const member = await Member.findById(memberId);
        const trainer = await Trainer.findById(trainerId);

        if (!member || !trainer) {
            return res.status(404).json({ message: "Member or trainer not found" });
        }

        // Update member's assigned trainer
        member.assignedTrainer = trainerId;
        await member.save();

        // Add member to trainer's clients list
        if (!trainer.clients.includes(memberId)) {
            trainer.clients.push(memberId);
            await trainer.save();
        }

        res.json({ message: "Trainer assigned successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error assigning trainer" });
    }
});

// Workout Plan Routes
app.post("/api/workout-plans", authMiddleware, authorize("trainer"), async (req, res) => {
    try {
        const { memberId, weeklyPlan } = req.body;
        const trainerId = req.user.id;

        const workoutPlan = new WorkoutPlan({
            memberId,
            trainerId,
            weeklyPlan
        });

        await workoutPlan.save();
        res.status(201).json(workoutPlan);
    } catch (error) {
        res.status(500).json({ message: "Error creating workout plan" });
    }
});

app.get("/api/workout-plans/:memberId", authMiddleware, async (req, res) => {
    try {
        const workoutPlan = await WorkoutPlan.findOne({
            memberId: req.params.memberId
        }).sort({ createdAt: -1 });

        if (!workoutPlan) {
            return res.status(404).json({ message: "Workout plan not found" });
        }

        res.json(workoutPlan);
    } catch (error) {
        res.status(500).json({ message: "Error fetching workout plan" });
    }
});

app.put("/api/workout-plans/:id", authMiddleware, authorize("trainer"), async (req, res) => {
    try {
        const { weeklyPlan } = req.body;
        const workoutPlan = await WorkoutPlan.findOneAndUpdate(
            { _id: req.params.id, trainerId: req.user.id },
            { weeklyPlan, updatedAt: Date.now() },
            { new: true }
        );

        if (!workoutPlan) {
            return res.status(404).json({ message: "Workout plan not found" });
        }

        res.json(workoutPlan);
    } catch (error) {
        res.status(500).json({ message: "Error updating workout plan" });
    }
});

app.get("/api/workout-plans", authMiddleware, async (req, res) => {
    try {
        const workoutPlans = await WorkoutPlan.find({ trainerId: req.user.id });
        res.json(workoutPlans);
    } catch (error) {
        res.status(500).json({ message: "Error fetching workout plans" });
    }
});

// Diet Plan Routes
app.post("/api/diet-plans", authMiddleware, authorize("trainer"), async (req, res) => {
    try {
        const { memberId, weeklyPlan } = req.body;
        const trainerId = req.user.id;

        const dietPlan = new DietPlan({
            memberId,
            trainerId,
            weeklyPlan
        });

        await dietPlan.save();
        res.status(201).json(dietPlan);
    } catch (error) {
        res.status(500).json({ message: "Error creating diet plan" });
    }
});

app.get("/api/diet-plans/:memberId", authMiddleware, async (req, res) => {
    try {
        const dietPlan = await DietPlan.findOne({
            memberId: req.params.memberId
        }).sort({ createdAt: -1 });

        if (!dietPlan) {
            return res.status(404).json({ message: "Diet plan not found" });
        }

        res.json(dietPlan);
    } catch (error) {
        res.status(500).json({ message: "Error fetching diet plan" });
    }
});

app.put("/api/diet-plans/:id", authMiddleware, authorize("trainer"), async (req, res) => {
    try {
        const { weeklyPlan } = req.body;
        const dietPlan = await DietPlan.findOneAndUpdate(
            { _id: req.params.id, trainerId: req.user.id },
            { weeklyPlan, updatedAt: Date.now() },
            { new: true }
        );

        if (!dietPlan) {
            return res.status(404).json({ message: "Diet plan not found" });
        }

        res.json(dietPlan);
    } catch (error) {
        res.status(500).json({ message: "Error updating diet plan" });
    }
});

// Public Routes
app.post("/api/users/signup", async (req, res) => {
    const { username, email, password, phone, userType } = req.body;

    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
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

        const token = jwt.sign(
            { id: newUser._id, userType: newUser.userType }, 
            process.env.JWT_SECRET || "myjwtsecretkey1616",
            { expiresIn: "1h" }
        );

        res.status(201).json({ user: newUser, token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
});

app.post("/api/users/login", async (req, res) => {
    const { username, password, role } = req.body;

    try {
        let user;
        if (role === "member") {
            user = await Member.findOne({ username });
        } else if (role === "trainer") {
            user = await Trainer.findOne({ username });
        }

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, userType: user.userType },
            process.env.JWT_SECRET || "myjwtsecretkey1616",
            { expiresIn: "1h" }
        );

        res.status(200).json({
            _id: user._id,
            username: user.username,
            userType: user.userType,
            email: user.email,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

// Protected Member Routes
app.post("/api/members/register", authMiddleware, authorize("member"), async (req, res) => {
    const { username, email, password, profilePic } = req.body;

    try {
        const existingMember = await Member.findOne({ $or: [{ email }, { username }] });
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

        const token = jwt.sign(
            { memberId: newMember._id, userType: "member" },
            process.env.JWT_SECRET || "myjwtsecretkey1616",
            { expiresIn: '1h' }
        );

        res.json({ token, message: 'Registration successful', member: newMember });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Member Routes
app.post("/api/members/signup", async (req, res) => {
    try {
        const { username, email, password, phone, age, gender, emergencyContact, healthConditions } = req.body;

        const existingMember = await Member.findOne({ $or: [{ email }, { username }] });
        if (existingMember) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newMember = await Member.create({
            username,
            email,
            password: hashedPassword,
            phone,
            age,
            gender,
            emergencyContact,
            healthConditions,
            userType: "member",
            membership: {
                status: "inactive" // Initially set as inactive
            }
        });

        const token = jwt.sign(
            { id: newMember._id, userType: "member" },
            process.env.JWT_SECRET || "myjwtsecretkey1616",
            { expiresIn: "1h" }
        );

        res.status(201).json({ 
            user: {
                _id: newMember._id,
                username: newMember.username,
                email: newMember.email,
                userType: "member"
            }, 
            token 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

// Protected Trainer Routes
app.post("/api/trainers/signup", upload.single('photo'), async (req, res) => {
    try {
        const {
            username,
            email,
            password,
            fullName,
            age,
            gender,
            phone,
            specialization,
            experience,
            certification,
            feePerMonth,
            availability
        } = req.body;

        const existingTrainer = await Trainer.findOne({ $or: [{ email }, { username }] });
        if (existingTrainer) {
            return res.status(400).json({ message: "Trainer already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const photoPath = req.file ? `/trainer/photos/${req.file.filename}` : null;

        const newTrainer = await Trainer.create({
            username,
            email,
            password: hashedPassword,
            fullName,
            age,
            gender,
            phone,
            specialization,
            experience,
            certification,
            feePerMonth,
            availability,
            photo: photoPath,
            userType: "trainer"
        });

        const token = jwt.sign(
            { id: newTrainer._id, userType: "trainer" },
            process.env.JWT_SECRET || "myjwtsecretkey1616",
            { expiresIn: "1h" }
        );

        res.status(201).json({ 
            user: {
                _id: newTrainer._id,
                username: newTrainer.username,
                email: newTrainer.email,
                userType: "trainer"
            }, 
            token 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

app.get("/api/trainer/members", authMiddleware, authorize("trainer"), async (req, res) => {
    try {
        const trainer = await Trainer.findById(req.user.id);
        const members = await Member.find({ _id: { $in: trainer.clients } }).select('-password');
        res.json(members);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.get("/api/trainers", async (req, res) => {
    try {
        const trainers = await Trainer.find().select('-password');
        res.json(trainers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Protected Member Profile Routes
app.get("/api/members/profile", authMiddleware, authorize("member"), async (req, res) => {
    try {
        const member = await Member.findById(req.user.id)
            .select('-password')
            .populate('assignedTrainer', 'fullName specialization experience');
        
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }
        res.json(member);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Update Member Profile Route
app.put("/api/members/profile", authMiddleware, authorize("member"), async (req, res) => {
    try {
        const updates = {
            username: req.body.username,
            email: req.body.email,
            phone: req.body.phone,
            age: req.body.age,
            gender: req.body.gender,
            emergencyContact: req.body.emergencyContact,
            healthConditions: req.body.healthConditions
        };

        const member = await Member.findByIdAndUpdate(
            req.user.id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password');

        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        res.json(member);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Update Trainer Profile Route
app.put("/api/trainers/profile", authMiddleware, authorize("trainer"), upload.single('photo'), async (req, res) => {
    try {
        const updates = {
            username: req.body.username,
            email: req.body.email,
            fullName: req.body.fullName,
            phone: req.body.phone,
            age: req.body.age,
            gender: req.body.gender,
            specialization: req.body.specialization,
            experience: req.body.experience,
            certification: req.body.certification,
            feePerMonth: req.body.feePerMonth,
            availability: req.body.availability
        };

        if (req.file) {
            updates.photo = `/trainer/photos/${req.file.filename}`;
        }

        const trainer = await Trainer.findByIdAndUpdate(
            req.user.id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password');

        if (!trainer) {
            return res.status(404).json({ message: 'Trainer not found' });
        }

        res.json(trainer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Protected Trainer Profile Routes
app.get("/api/trainers/profile", authMiddleware, authorize("trainer"), async (req, res) => {
    try {
        const trainer = await Trainer.findById(req.user.id).select('-password');
        
        if (!trainer) {
            return res.status(404).json({ message: 'Trainer not found' });
        }
        res.json(trainer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Event Routes
app.post("/api/events", authMiddleware, async (req, res) => {
    try {
        const { title, date } = req.body;
        const event = new Event({
            userId: req.user.id,
            title,
            date: new Date(date)
        });
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: "Error creating event" });
    }
});

app.get("/api/events", authMiddleware, async (req, res) => {
    try {
        const events = await Event.find({ userId: req.user.id });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: "Error fetching events" });
    }
});

app.delete("/api/events/:id", authMiddleware, async (req, res) => {
    try {
        await Event.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        res.json({ message: "Event deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting event" });
    }
});

app.put("/api/events/:id", authMiddleware, async (req, res) => {
    try {
        const { title, date } = req.body;
        const event = await Event.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { title, date },
            { new: true }
        );
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: "Error updating event" });
    }
});

// Razorpay Routes
app.post('/api/create-order', authMiddleware, async (req, res) => {
    try {
        const { amount } = req.body;
        
        const options = {
            amount: amount,
            currency: "INR",
            receipt: "order_" + Date.now(),
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: "Error creating order" });
    }
});

app.post('/api/verify-payment', authMiddleware, async (req, res) => {
    try {
        const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            planName
        } = req.body;

        // Verify payment signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", razorpay.key_secret)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Update member's membership status
            const member = await Member.findById(req.user.id);
            if (!member) {
                return res.status(404).json({ message: "Member not found" });
            }

            member.membership = {
                type: planName,
                startDate: new Date(),
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                status: "active"
            };

            await member.save();
            res.json({ message: "Payment verified and membership activated" });
        } else {
            res.status(400).json({ message: "Invalid signature" });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ message: "Error verifying payment" });
    }
});

// Get member's current plan
app.get("/api/members/current-plan", authMiddleware, authorize("member"), async (req, res) => {
    try {
        const member = await Member.findById(req.user.id).select('membership');
        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }
        res.json(member.membership);
    } catch (error) {
        res.status(500).json({ message: "Error fetching current plan" });
    }
});

// Update membership plan
app.post("/api/members/update-plan", authMiddleware, authorize("member"), async (req, res) => {
    try {
        const { planName, amount } = req.body;
        
        // Create Razorpay order
        const order = await razorpay.orders.create({
            amount: amount * 100, // Convert to paise
            currency: "INR",
            receipt: "order_" + Date.now(),
        });

        // Update member's plan details
        const member = await Member.findById(req.user.id);
        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }

        member.membership = {
            type: planName,
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            status: "active"
        };

        await member.save();
        res.json({ order, member });
    } catch (error) {
        res.status(500).json({ message: "Error updating plan" });
    }
});

// Connect to Database and Start Server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
