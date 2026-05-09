const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    manager: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    members: [{
        type: mongoose.Types.ObjectId,
        ref: "User",
        default: []
    }],
    tasks: [{
        type: mongoose.Types.ObjectId,
        ref: "Task",
        default: []
    }],
    status: {
        type: String,
        enum: ['active', 'completed', 'on-hold'],
        default: 'active'
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
