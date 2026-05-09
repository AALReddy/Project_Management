const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'manager', 'member'],
        default: 'member',
        required: true
    },
    tasks: [{
        type: mongoose.Types.ObjectId,
        ref: "Task",
    }],
    projects: [{
        type: mongoose.Types.ObjectId,
        ref: "Project",
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });
 
module.exports = mongoose.model("User", userSchema);