const router = require("express").Router();
const User = require("../models/user");
const Project = require("../models/project");
const Task = require("../models/task");
const { isAdmin } = require("./auth");

// Get all users (admin only)
router.get("/get-all-users", isAdmin, async (req, res) => {
    try {
        const users = await User.find({}, "-password").populate("projects");
        res.status(200).json({ users });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Create a new user (admin only)
router.post("/create-user", isAdmin, async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        const bcrypt = require("bcrypt");
        const hashPass = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashPass,
            role
        });

        await newUser.save();
        res.status(200).json({ message: "User created successfully", userId: newUser._id });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Update user role (admin only)
router.put("/update-user-role", isAdmin, async (req, res) => {
    try {
        const { userId, role } = req.body;

        if (!userId || !role) {
            return res.status(400).json({ message: "User ID and role are required." });
        }

        if (!['admin', 'manager', 'member'].includes(role)) {
            return res.status(400).json({ message: "Invalid role." });
        }

        const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ message: "User role updated successfully", user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Delete user (admin only)
router.delete("/delete-user", isAdmin, async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        // Remove user from projects
        await Project.updateMany({}, { $pull: { members: userId } });
        
        // Delete user's tasks
        await Task.deleteMany({ assignedTo: userId });

        // Delete user
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get dashboard statistics (admin only)
router.get("/dashboard-stats", isAdmin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProjects = await Project.countDocuments();
        const totalTasks = await Task.countDocuments();
        const completedTasks = await Task.countDocuments({ isComplete: true });
        const overdueTasks = await Task.countDocuments({ 
            dueDate: { $lt: new Date() }, 
            isComplete: false 
        });

        const tasksByStatus = await Task.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const tasksPerUser = await Task.aggregate([
            {
                $group: {
                    _id: "$assignedTo",
                    taskCount: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $project: {
                    userId: "$_id",
                    username: "$user.username",
                    taskCount: 1
                }
            }
        ]);

        res.status(200).json({
            stats: {
                totalUsers,
                totalProjects,
                totalTasks,
                completedTasks,
                overdueTasks,
                tasksByStatus,
                tasksPerUser
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
