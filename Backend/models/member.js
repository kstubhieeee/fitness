const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Member schema
const memberSchema = new Schema({
    username: { type: String, required: true, unique: true }, // Username field
    email: { type: String, required: true, unique: true }, // Email field
    password: { type: String, required: true }, // Password field
    profilePic: { type: String }, // Profile picture URL
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

// Create the Member model
const Member = mongoose.model('Member', memberSchema);

module.exports = Member;
