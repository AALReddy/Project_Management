const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    project: {
        type: mongoose.Types.ObjectId,
        ref: "Project",
        required: true
    },
    assignedTo: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ['To Do', 'In Progress', 'Done'],
        default: 'To Do'
    },
    dueDate: {
        type: Date,
        required: true
    },
    isComplete: {
        type: Boolean,
        default: false
    },
    isImportant: {
        type: Boolean,
        default: false
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

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
