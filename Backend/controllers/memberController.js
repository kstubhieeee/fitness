const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Member = require('../models/member');

// Register a new member
exports.registerMember = async (req, res) => {
    const { username, email, password, profilePic } = req.body;

    try {
        // Check if the member already exists
        const existingMember = await Member.findOne({ email });
        if (existingMember) {
            return res.status(400).json({ message: 'Member already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new member
        const newMember = new Member({
            username: username,
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

        // Generate JWT token
        const token = jwt.sign({ memberId: newMember._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, message: 'Registration successful', member: newMember });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Member login
exports.loginMember = async (req, res) => {
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

        // Generate JWT token
        const token = jwt.sign({ memberId: member._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, message: 'Login successful', member });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get member details by ID
exports.getMemberDetails = async (req, res) => {
    try {
        const member = await Member.findById(req.memberId); // Extract memberId from JWT token
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }
        res.json(member);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};
