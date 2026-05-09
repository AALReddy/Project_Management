# 🎯 Ease2Work - Project Manager (MERN Stack)

A comprehensive full-stack web application for team project management with role-based access control, advanced task management, and real-time collaboration features.

## ✨ Key Features

### 🔐 Role-Based Access Control
- **Admin**: Manage users, projects, system statistics
- **Manager**: Create projects, manage teams, assign tasks, track performance
- **Member**: View projects, manage assigned tasks, update status

### 📊 Project Management
- Create and manage projects
- Add/remove team members dynamically
- View team performance metrics
- Project-specific statistics

### ✅ Task Management
- Create tasks with Title, Description, Due Date, Priority
- Assign tasks to team members
- Update status (To Do, In Progress, Done)
- Track overdue tasks
- Mark tasks as important
- View tasks by status and filter

### 📈 Dashboard & Analytics
- System-wide statistics (Admin)
- Project analytics (Manager)
- Task completion rates
- Team member performance tracking
- Tasks by status breakdown
- Overdue task monitoring

### 🎨 Modern UI/UX
- Beautiful dark theme with gradients
- Glassmorphism effects
- Responsive design
- Kanban board view
- Real-time updates

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB
- npm or yarn

### Installation

#### 1. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
DB_USER_NAME=your_mongodb_username
DB_PASSWORD=your_mongodb_password
DB_NAME=project_manager
DB_CLUSTER=cluster0.5oqpm.mongodb.net
JWT_SECRET=your_jwt_secret_key
PORT=8800
```

Start the backend server:
```bash
npm start
```
Server runs on `http://localhost:8800`

#### 2. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
REACT_APP_API_BASE_URL=http://localhost:8800
```

Start the frontend development server:
```bash
npm start
```
Frontend runs on `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints (`/api/v1/`)
```
POST   /sign-in     - Register new user
POST   /log-in      - User login
```

### Admin Endpoints (`/api/v3/`)
```
GET    /get-all-users           - Get all users
POST   /create-user             - Create new user
PUT    /update-user-role        - Update user role
DELETE /delete-user             - Delete user
GET    /dashboard-stats         - Get system statistics
```

### Project Endpoints (`/api/v4/`)
```
POST   /create-project          - Create project
GET    /get-projects            - Get user's projects
GET    /get-project/:id         - Get specific project
PUT    /add-members             - Add members to project
PUT    /remove-members          - Remove members from project
PUT    /update-project          - Update project details
GET    /team-performance/:id    - Get team performance
DELETE /delete-project          - Delete project
```

### Task Endpoints (`/api/v2/`)
```
POST   /create-task             - Create task
GET    /get-project-tasks/:id   - Get project tasks
GET    /get-my-tasks            - Get user's tasks
GET    /get-tasks-by-status/:projectId/:status - Filter by status
GET    /get-overdue-tasks/:id   - Get overdue tasks
PUT    /update-task-status      - Update task status
PUT    /update-task             - Update task details
PUT    /toggle-importance       - Toggle task importance
DELETE /delete-task             - Delete task
GET    /get-dashboard-stats/:id - Get task statistics
```

## 🗂️ Project Structure

```
project-manager/
├── backend/
│   ├── models/
│   │   ├── user.js
│   │   ├── project.js
│   │   └── task.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── user.js
│   │   ├── task.js
│   │   ├── admin.js
│   │   └── project.js
│   ├── app.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TaskManager.jsx
│   │   │   ├── TeamMemberManager.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signin.jsx
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── ProjectDashboard.jsx
│   │   │   ├── TasksPage.jsx
│   │   │   ├── Dash.jsx
│   │   │   └── ...
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   ├── storage.js
│   │   │   └── tasks.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── README.md
```

## 🔐 User Roles & Permissions

### Admin
- ✅ Create/delete/update users
- ✅ Change user roles
- ✅ View all projects and tasks
- ✅ Delete any project or task
- ✅ Access admin dashboard
- ✅ View system statistics

### Manager
- ✅ Create projects
- ✅ Add/remove team members
- ✅ Create and assign tasks
- ✅ Update task details and status
- ✅ View team performance
- ✅ Delete own tasks and projects
- ❌ Cannot manage users or system settings

### Member
- ✅ View assigned projects
- ✅ View assigned tasks
- ✅ Update assigned task status
- ✅ Mark tasks as important
- ❌ Cannot create projects
- ❌ Cannot create or delete tasks
- ❌ Cannot manage team members

## 🎯 Usage Guide

### For Admin Users
1. Sign up/Login as Admin
2. Navigate to Admin Dashboard
3. Manage users, update roles, delete users
4. View system-wide statistics
5. Monitor all projects and tasks

### For Manager Users
1. Sign up/Login as Manager
2. Go to "My Projects"
3. Create new project and add description
4. Click "Manage Team" to add members
5. Click "Add Task" to create tasks
6. Assign tasks to team members
7. Track team performance

### For Member Users
1. Sign up/Login as Member
2. View assigned projects in dashboard
3. Go to "Tasks" to see task board
4. Update task status as you work
5. Mark important tasks

## 💾 Database Schema

### User
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String (hashed),
  role: String,
  tasks: [ObjectId],
  projects: [ObjectId],
  createdAt: Date
}
```

### Project
```javascript
{
  _id: ObjectId,
  projectName: String,
  description: String,
  manager: ObjectId (User),
  members: [ObjectId (User)],
  tasks: [ObjectId],
  status: String,
  createdBy: ObjectId (User),
  createdAt: Date
}
```

### Task
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  project: ObjectId (Project),
  assignedTo: ObjectId (User),
  priority: String,
  status: String,
  dueDate: Date,
  isComplete: Boolean,
  isImportant: Boolean,
  createdBy: ObjectId (User),
  createdAt: Date
}
```

## 🛠️ Technology Stack

### Frontend
- React 18
- React Router v6
- React Icons
- Modern CSS3 with Glassmorphism
- Responsive Design

### Backend
- Express.js
- Node.js
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt for password hashing
- CORS

### Tools
- Git & GitHub
- VS Code
- Postman (for API testing)
- MongoDB Compass (optional)

## 📝 Features Documentation

For detailed feature documentation, see [FEATURES.md](./FEATURES.md)

## 🐛 Troubleshooting

### Frontend not connecting to backend
- Check if backend is running on port 8800
- Verify `.env` file in frontend has correct API URL
- Clear browser cache

### Database connection issues
- Verify MongoDB connection string in `.env`
- Check if MongoDB cluster allows IP whitelist
- Ensure database credentials are correct

### Port conflicts
- Backend: Change PORT in `.env`
- Frontend: Use `PORT=3001 npm start`

## 📧 Support
For issues or questions, please create an issue in the repository.

## 📄 License
This project is open-source and available under the MIT License.

## 👨‍💻 Contributors
- Initial Development: Team
- Last Updated: May 2026

---

**Status**: ✅ Complete and Production Ready
**Version**: 1.0.0
   - Disable or activate accounts.
   - Permanently delete or trash tasks.



### *Features:*

1. *User Authentication and Authorization:*

   - Secure login and registration with JWT (JSON Web Tokens).
   - Role-based access control (Admin, Manager, Member)

2. *Project Creation and Management:*

   - Create new projects, assign members, and set deadlines.
   - View a detailed project overview with milestones and progress tracking.

3. *Task Management:*

   - Add, edit, and delete tasks within projects.
   - Assign tasks to team members with due dates and priorities.

4. *Real-Time Collaboration:*

   - Real-time updates on project and task changes using WebSockets (Socket.io).
   - Notifications for task updates, project changes, and deadlines.

5. *Team Management:*
   - Add, remove, or modify team members within projects.
   - Assign different roles to users (Admin, Project Manager, Developer, etc.).
   - Role-based access control for tasks, projects, and team settings.

### *Technology Used:*

1. *Core Technologies*
    - HTML5: Used to structure content and define the overall layout of the website.
    - CSS3: For styling the visual elements of the website, including layout, colors, fonts, and responsiveness.
    - JavaScript (ES6+): Provides interactivity and handles dynamic user interactions (e.g., updating task lists, handling project timelines).

2. *Frontend Frameworks and Libraries*
    - React.js: A JavaScript library for building user interfaces, with component-based architecture.
        - State Management: Context API or Redux to handle global application state.
        - React Hooks: For managing state and lifecycle features within functional components.

3. *UI libraries* 
    -Tailwind CSS: A utility-first CSS framework that allows for quick and easy styling of components.

4. State Management
    - Redux: A state management library, especially useful in React apps to handle complex application state (such as user data, tasks, project milestones).

5. *Routing and Navigation*
    - React Router: Handles navigation between different pages and views in a React application.
    
6. *API Integration*
    -Axios: A popular promise-based HTTP client used to send requests to the backend API and fetch project, task, or user data.
    -Fetch API: A native browser API used for making HTTP requests.



The Cloud-Based Task Manager is an innovative solution that brings efficiency and organization to task management within teams. By harnessing the power of the MERN stack and modern frontend technologies, the platform provides a seamless experience for both administrators and users, fostering collaboration and productivity.



## SETUP INSTRUCTIONS

# Server Setup

## Environment Variables

First, create the environment variables file .env in the server folder. The .env file contains the following environment variables:

- MONGODB_URI = your MongoDB URL
- JWT_SECRET = any secret key - must be secured
- PORT = 8800 or any port number
- NODE_ENV = development

&nbsp;

## Set Up MongoDB:

1. Setting up MongoDB involves a few steps:

   - Visit MongoDB Atlas Website

     - Go to the MongoDB Atlas website: [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).

   - Create an Account
   - Log in to your MongoDB Atlas account.
   - Create a New Cluster
   - Choose a Cloud Provider and Region
   - Configure Cluster Settings
   - Create Cluster
   - Wait for Cluster to Deploy
   - Create Database User
   - Set Up IP Whitelist
   - Connect to Cluster
   - Configure Your Application
   - Test the Connection

2. Create a new database and configure the .env file with the MongoDB connection URL.

## Steps to run server

1. Open the project in any editor of choice.
2. Navigate into the server directory cd server.
3. Run npm i or npm install to install the packages.
4. Run npm start to start the server.

If configured correctly, you should see a message indicating that the server is running successfully and Database Connected.

&nbsp;

## Steps to run client

1. Navigate into the client directory cd client.
2. Run npm i or npm install to install the packages.
3. Run npm start to run the app on http://localhost:3000.
4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

&nbsp;
