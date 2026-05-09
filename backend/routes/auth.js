const jwt = require("jsonwebtoken");

// Middleware function to authenticate JWT token
const authenticateToken = (req, res, next) => {
    // Get token from headers (ensure Authorization header is set)
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
    console.log(token)
    if (!token) {
        return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET || 'tcmTM', (err, user) => {
        if (err) {
            console.error("Token verification error:", err);
            return res.status(403).json({ message: "Invalid or expired token." });
        }

        // Attach the user info to the request object
        req.user = user;
        req.body=req.body
        next(); // Pass to the next middleware or route handler
    });
}; 

// Middleware function to check if user is admin
const isAdmin = (req, res, next) => {
    authenticateToken(req, res, () => {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Unauthorized. Admin access required." });
        }
        next();
    });
};

// Middleware function to check if user is manager
const isManager = (req, res, next) => {
    authenticateToken(req, res, () => {
        if (req.user.role !== 'manager' && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Unauthorized. Manager access required." });
        }
        next();
    });
};

// Middleware function to check if user has access to resource
const hasAccessToProject = async (req, res, next) => {
    try {
        authenticateToken(req, res, async () => {
            const { projectId } = req.body;
            const User = require("../models/user");
            const Project = require("../models/project");
            
            if (!projectId) {
                return res.status(400).json({ message: "Project ID is required." });
            }

            const project = await Project.findById(projectId);
            if (!project) {
                return res.status(404).json({ message: "Project not found." });
            }

            const user = await User.findById(req.user.id);
            
            // Admin can access all projects
            if (user.role === 'admin') {
                next();
                return;
            }

            // Manager can access if they are the manager of the project
            if (user.role === 'manager' && project.manager.equals(req.user.id)) {
                next();
                return;
            }

            // Member can access if they are in the project's members list
            if (user.role === 'member' && project.members.some(memberId => memberId.equals(req.user.id))) {
                next();
                return;
            }

            return res.status(403).json({ message: "You do not have access to this project." });
        });
    } catch (error) {
        console.error("Error in hasAccessToProject middleware:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { authenticateToken, isAdmin, isManager, hasAccessToProject };
