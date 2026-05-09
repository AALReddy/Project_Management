const router = require("express").Router();
const Task = require("../models/task");
const User = require("../models/user");
const Project = require("../models/project");
const { authenticateToken, isManager } = require("./auth");

// Create task (manager and admin only)
router.post("/create-task", authenticateToken, async (req, res) => {
    try {
        const { title, description, projectId, assignedToId, priority, dueDate } = req.body;
        const userId = req.user.id;

        // Validate input
        if (!title || !description || !projectId || !assignedToId || !dueDate) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Check user role
        const user = await User.findById(userId);
        const project = await Project.findById(projectId);
        const assignedUser = await User.findById(assignedToId);

        if (!project) {
            return res.status(404).json({ message: "Project not found." });
        }
        if (!assignedUser) {
            return res.status(404).json({ message: "Assigned user not found." });
        }

        // Only manager of the project and admin can create tasks
        if (user.role !== 'admin' && !project.manager.equals(userId)) {
            return res.status(403).json({ message: "Only project manager and admin can create tasks." });
        }

        // Assigned user must belong to project members
        if (!project.members.some((memberId) => memberId.equals(assignedToId))) {
            return res.status(400).json({ message: "Assigned user is not a project member." });
        }

        // Create new task
        const newTask = new Task({
            title,
            description,
            project: projectId,
            assignedTo: assignedToId,
            priority: priority || 'medium',
            dueDate: new Date(dueDate),
            createdBy: userId
        });

        await newTask.save();

        // Add task to project
        await Project.findByIdAndUpdate(projectId, { $push: { tasks: newTask._id } });

        // Add task to user
        await User.findByIdAndUpdate(assignedToId, { $push: { tasks: newTask._id } });

        res.status(200).json({ message: "Task created successfully", task: newTask });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get all tasks for a project
router.get("/get-project-tasks/:projectId", authenticateToken, async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.user.id;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found." });
        }

        const user = await User.findById(userId);
        if (user.role !== 'admin' && !project.manager.equals(userId) && !project.members.some(m => m.equals(userId))) {
            return res.status(403).json({ message: "You don't have access to this project." });
        }

        const tasks = await Task.find({ project: projectId })
            .populate("assignedTo", "username email")
            .populate("createdBy", "username email")
            .sort({ createdAt: -1 });

        res.status(200).json({ tasks });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get tasks assigned to current user
router.get("/get-my-tasks", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const tasks = await Task.find({ assignedTo: userId })
            .populate("project", "projectName")
            .populate("createdBy", "username email")
            .sort({ dueDate: 1 });

        res.status(200).json({ tasks });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get tasks by status
router.get("/get-tasks-by-status/:projectId/:status", authenticateToken, async (req, res) => {
    try {
        const { projectId, status } = req.params;
        const userId = req.user.id;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found." });
        }

        const user = await User.findById(userId);
        if (user.role !== 'admin' && !project.manager.equals(userId) && !project.members.some(m => m.equals(userId))) {
            return res.status(403).json({ message: "You don't have access to this project." });
        }

        const tasks = await Task.find({ project: projectId, status })
            .populate("assignedTo", "username email")
            .sort({ createdAt: -1 });

        res.status(200).json({ tasks });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get overdue tasks
router.get("/get-overdue-tasks/:projectId", authenticateToken, async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.user.id;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found." });
        }

        const user = await User.findById(userId);
        if (user.role !== 'admin' && !project.manager.equals(userId) && !project.members.some(m => m.equals(userId))) {
            return res.status(403).json({ message: "You don't have access to this project." });
        }

        const tasks = await Task.find({
            project: projectId,
            dueDate: { $lt: new Date() },
            isComplete: false
        })
            .populate("assignedTo", "username email")
            .sort({ dueDate: 1 });

        res.status(200).json({ tasks });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Update task status
router.put("/update-task-status", authenticateToken, async (req, res) => {
    try {
        const { taskId, status } = req.body;
        const userId = req.user.id;

        if (!taskId || !status) {
            return res.status(400).json({ message: "Task ID and status are required." });
        }

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found." });
        }

        const user = await User.findById(userId);
        const project = await Project.findById(task.project);

        // Only manager, assigned user, and admin can update status
        if (user.role !== 'admin' && !project.manager.equals(userId) && !task.assignedTo.equals(userId)) {
            return res.status(403).json({ message: "You don't have permission to update this task." });
        }

        if (!['To Do', 'In Progress', 'Done'].includes(status)) {
            return res.status(400).json({ message: "Invalid status." });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { status, isComplete: status === 'Done' },
            { new: true }
        );

        res.status(200).json({ message: "Task status updated successfully", task: updatedTask });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Update task
router.put("/update-task", authenticateToken, async (req, res) => {
    try {
        const { taskId, title, description, priority, dueDate, assignedToId } = req.body;
        const userId = req.user.id;

        if (!taskId) {
            return res.status(400).json({ message: "Task ID is required." });
        }

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found." });
        }

        const user = await User.findById(userId);
        const project = await Project.findById(task.project);

        // Only manager and admin can update task
        if (user.role !== 'admin' && !project.manager.equals(userId)) {
            return res.status(403).json({ message: "You don't have permission to update this task." });
        }

        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (priority) updateData.priority = priority;
        if (dueDate) updateData.dueDate = new Date(dueDate);
        if (assignedToId) updateData.assignedTo = assignedToId;

        const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, { new: true });

        res.status(200).json({ message: "Task updated successfully", task: updatedTask });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Toggle task importance
router.put("/toggle-importance", authenticateToken, async (req, res) => {
    try {
        const { taskId } = req.body;
        const userId = req.user.id;

        if (!taskId) {
            return res.status(400).json({ message: "Task ID is required." });
        }

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found." });
        }

        // Only assigned user and creator can toggle importance
        if (!task.assignedTo.equals(userId) && !task.createdBy.equals(userId)) {
            return res.status(403).json({ message: "You don't have permission to update this task." });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { isImportant: !task.isImportant },
            { new: true }
        );

        res.status(200).json({ message: "Task importance toggled successfully", task: updatedTask });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Delete task (manager and admin only)
router.delete("/delete-task", authenticateToken, async (req, res) => {
    try {
        const { taskId } = req.body;
        const userId = req.user.id;

        if (!taskId) {
            return res.status(400).json({ message: "Task ID is required." });
        }

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found." });
        }

        const user = await User.findById(userId);
        const project = await Project.findById(task.project);

        // Only manager and admin can delete task
        if (user.role !== 'admin' && !project.manager.equals(userId)) {
            return res.status(403).json({ message: "You don't have permission to delete this task." });
        }

        // Remove task from project
        await Project.findByIdAndUpdate(project._id, { $pull: { tasks: taskId } });

        // Remove task from user
        await User.findByIdAndUpdate(task.assignedTo, { $pull: { tasks: taskId } });

        // Delete task
        await Task.findByIdAndDelete(taskId);

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get dashboard statistics
router.get("/get-dashboard-stats/:projectId", authenticateToken, async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.user.id;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found." });
        }

        const user = await User.findById(userId);
        if (user.role !== 'admin' && !project.manager.equals(userId) && !project.members.some(m => m.equals(userId))) {
            return res.status(403).json({ message: "You don't have access to this project." });
        }

        const totalTasks = await Task.countDocuments({ project: projectId });
        const completedTasks = await Task.countDocuments({ project: projectId, isComplete: true });
        const overdueTasks = await Task.countDocuments({
            project: projectId,
            dueDate: { $lt: new Date() },
            isComplete: false
        });

        const tasksByStatus = await Task.aggregate([
            { $match: { project: project._id } },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const tasksPerUser = await Task.aggregate([
            { $match: { project: project._id } },
            {
                $group: {
                    _id: "$assignedTo",
                    taskCount: { $sum: 1 },
                    completedCount: {
                        $sum: { $cond: [{ $eq: ["$isComplete", true] }, 1, 0] }
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
                    taskCount: 1,
                    completedCount: 1,
                    completionPercentage: {
                        $multiply: [
                            { $divide: ["$completedCount", "$taskCount"] },
                            100
                        ]
                    }
                }
            }
        ]);

        res.status(200).json({
            stats: {
                totalTasks,
                completedTasks,
                overdueTasks,
                tasksPercentage: totalTasks ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0,
                tasksByStatus,
                tasksPerUser
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Legacy endpoint for compatibility
router.post("/get-all-tasks", async (req, res) => {
    try {
        const { project } = req.body;
        const tasks = await Task.find({ project })
            .populate("assignedTo", "username email")
            .sort({ createdAt: -1 });
        res.status(200).json({ data: tasks });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Legacy endpoint for compatibility
router.put("/changestatus", authenticateToken, async (req, res) => {
    try {
        const { id } = req.body;
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: "Task not found." });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { isComplete: !task.isComplete },
            { new: true }
        );
        res.status(200).json({ message: "Task status updated successfully", task: updatedTask });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
