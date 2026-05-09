const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const UserAPI = require("./routes/user");
const TaskAPI = require("./routes/task");
const AdminAPI = require("./routes/admin");
const ProjectAPI = require("./routes/project");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Project = require("./models/project");

// Middleware
app.use(cors());
app.use(express.json());
const mongoose = require("mongoose");

const USER_NAME = process.env.DB_USER_NAME;
const PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const DB_CLUSTER = process.env.DB_CLUSTER || "cluster0.5oqpm.mongodb.net";

const MONGO_URI = `mongodb+srv://${USER_NAME}:${PASSWORD}@${DB_CLUSTER}/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

const response = mongoose.connect(MONGO_URI)
.then((data)=>{
    console.log("Database has been connected successfully");
})
.catch((err)=>{
    console.log('Database Connection Error:',err.message);
})

// API routes 
app.use("/api/v1", UserAPI);        // User endpoints: localhost:8800/api/v1/sign-in 
app.use("/api/v2", TaskAPI);        // Task endpoints: localhost:8800/api/v2/create-task
app.use("/api/v3", AdminAPI);       // Admin endpoints: localhost:8800/api/v3/get-all-users
app.use("/api/v4", ProjectAPI);     // Project endpoints: localhost:8800/api/v4/create-project

// Default route
app.get("/", (req, res) => {
    res.send("Hello from Project Manager backend - v1.0");
});

// Legacy project creation endpoint (for compatibility)
app.post("/create-project", async (req, res) => {
    try {
        const {status, projectName, description ,members,manager } = req.body;
        let project = new Project({ status, projectName, description, manager, members });
        project = await project.save();
        res.status(200).json({ message: "Project Created", project });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Legacy get projects endpoint (for compatibility)
app.get("/getprojects", async (req, res) => {
    try {
        let projects = await Project.find();
        res.status(200).json({projects});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

// Server setup
const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
