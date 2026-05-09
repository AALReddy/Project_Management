const router = require("express").Router();
const Project = require("../models/project");
const User = require("../models/user");
const Task = require("../models/task");
const { authenticateToken, isManager, isAdmin } = require("./auth");

// Create a new project (manager and admin only)
router.post("/create-project", authenticateToken, async (req, res) => {
    try {
        const { projectName, description, members, managerId, status } = req.body;
        const userId = req.user.id;

        // Check if user is manager or admin
        const user = await User.findById(userId);
        if (!user || (user.role !== 'manager' && user.role !== 'admin')) {
            return res.status(403).json({ message: "Only managers and admins can create projects." });
        }

        if (!projectName || !description) {
            return res.status(400).json({ message: "Project name and description are required." });
        }

        const assignedManagerId =
            user.role === "admin" && managerId ? managerId : userId;

        const managerUser = await User.findById(assignedManagerId);
        if (!managerUser || managerUser.role !== "manager") {
            return res.status(400).json({ message: "A valid manager is required." });
        }

        const uniqueMembers = Array.isArray(members)
            ? [...new Set(members.filter(Boolean))]
            : [];

        const newProject = new Project({
            projectName,
            description,
            manager: assignedManagerId,
            members: uniqueMembers,
            status: status || "active",
            createdBy: userId,
        });

        await newProject.save();

        // Add project to manager and members
        await User.findByIdAndUpdate(
            assignedManagerId,
            { $addToSet: { projects: newProject._id } }
        );

        if (uniqueMembers.length > 0) {
            await User.updateMany(
                { _id: { $in: uniqueMembers } },
                { $addToSet: { projects: newProject._id } }
            );
        }

        res.status(200).json({ message: "Project created successfully", project: newProject });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get all projects (for current user based on role)
router.get("/get-projects", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        let projects;
        if (user.role === 'admin') {
            // Admin can see all projects
            projects = await Project.find()
                .populate("manager", "username email")
                .populate("members", "username email")
                .populate("createdBy", "username email");
        } else if (user.role === 'manager') {
            // Manager can see projects they manage and are part of
            projects = await Project.find({
                $or: [
                    { manager: userId },
                    { members: userId }
                ]
            })
                .populate("manager", "username email")
                .populate("members", "username email")
                .populate("createdBy", "username email");
        } else {
            // Member can only see projects they are part of
            projects = await Project.find({ members: userId })
                .populate("manager", "username email")
                .populate("members", "username email")
                .populate("createdBy", "username email");
        }

        res.status(200).json({ projects });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get a specific project
router.get("/get-project/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const user = await User.findById(userId);

        const project = await Project.findById(id)
            .populate("manager", "username email")
            .populate("members", "username email role")
            .populate("createdBy", "username email")
            .populate("tasks");

        if (!project) {
            return res.status(404).json({ message: "Project not found." });
        }

        // Check access
        if (user.role !== 'admin' && !project.manager.equals(userId) && !project.members.some(m => m._id.equals(userId))) {
            return res.status(403).json({ message: "You don't have access to this project." });
        }

        res.status(200).json({ project });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Add members to project (manager of project or admin)
router.put("/add-members", authenticateToken, async (req, res) => {
    try {
        const { projectId, memberIds } = req.body;
        const userId = req.user.id;

        if (!projectId || !memberIds || memberIds.length === 0) {
            return res.status(400).json({ message: "Project ID and member IDs are required." });
        }

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found." });
        }

        const user = await User.findById(userId);
        if (user.role !== 'admin' && !project.manager.equals(userId)) {
            return res.status(403).json({ message: "Only project manager and admin can add members." });
        }

        // Add members to project
        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            { $addToSet: { members: { $each: memberIds } } },
            { new: true }
        );

        // Add project to members' projects
        await User.updateMany(
            { _id: { $in: memberIds } },
            { $addToSet: { projects: projectId } }
        );

        res.status(200).json({ message: "Members added successfully", project: updatedProject });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Remove members from project (manager of project or admin)
router.put("/remove-members", authenticateToken, async (req, res) => {
    try {
        const { projectId, memberIds } = req.body;
        const userId = req.user.id;

        if (!projectId || !memberIds || memberIds.length === 0) {
            return res.status(400).json({ message: "Project ID and member IDs are required." });
        }

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found." });
        }

        const user = await User.findById(userId);
        if (user.role !== 'admin' && !project.manager.equals(userId)) {
            return res.status(403).json({ message: "Only project manager and admin can remove members." });
        }

        // Remove members from project
        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            { $pull: { members: { $in: memberIds } } },
            { new: true }
        );

        // Remove project from members' projects
        await User.updateMany(
            { _id: { $in: memberIds } },
            { $pull: { projects: projectId } }
        );

        // Delete tasks assigned to removed members
        await Task.deleteMany({
            project: projectId,
            assignedTo: { $in: memberIds }
        });

        res.status(200).json({ message: "Members removed successfully", project: updatedProject });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Update project
router.put("/update-project", authenticateToken, async (req, res) => {
    try {
        const { projectId, projectName, description, status } = req.body;
        const userId = req.user.id;

        if (!projectId) {
            return res.status(400).json({ message: "Project ID is required." });
        }

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found." });
        }

        const user = await User.findById(userId);
        if (user.role !== 'admin' && !project.manager.equals(userId)) {
            return res.status(403).json({ message: "Only project manager and admin can update project." });
        }

        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            { projectName, description, status },
            { new: true }
        );

        res.status(200).json({ message: "Project updated successfully", project: updatedProject });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get team performance (manager of project or admin)
router.get("/team-performance/:projectId", authenticateToken, async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.user.id;

        const project = await Project.findById(projectId).populate("members");
        if (!project) {
            return res.status(404).json({ message: "Project not found." });
        }

        const user = await User.findById(userId);
        if (user.role !== 'admin' && !project.manager.equals(userId)) {
            return res.status(403).json({ message: "Only project manager and admin can view team performance." });
        }

        // Get team performance data
        const teamPerformance = await Task.aggregate([
            { $match: { project: project._id } },
            {
                $group: {
                    _id: "$assignedTo",
                    totalTasks: { $sum: 1 },
                    completedTasks: {
                        $sum: { $cond: [{ $eq: ["$isComplete", true] }, 1, 0] }
                    },
                    tasksByStatus: {
                        $push: {
                            status: "$status",
                            count: 1
                        }
                    }
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
                    email: "$user.email",
                    totalTasks: 1,
                    completedTasks: 1,
                    completionPercentage: {
                        $multiply: [
                            { $divide: ["$completedTasks", "$totalTasks"] },
                            100
                        ]
                    },
                    tasksByStatus: 1
                }
            }
        ]);

        res.status(200).json({ teamPerformance, projectName: project.projectName });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Delete project (admin only)
router.delete("/delete-project", isAdmin, async (req, res) => {
    try {
        const { projectId } = req.body;

        if (!projectId) {
            return res.status(400).json({ message: "Project ID is required." });
        }

        // Delete all tasks related to the project
        await Task.deleteMany({ project: projectId });

        // Remove project from all users' projects
        await User.updateMany({}, { $pull: { projects: projectId } });

        // Delete project
        const project = await Project.findByIdAndDelete(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found." });
        }

        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
