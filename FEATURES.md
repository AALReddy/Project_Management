# Project Manager - Complete Feature Documentation

## Project Overview
AstraTrack is a comprehensive MERN stack (MongoDB, Express, React, Node.js) project management application with role-based access control, team collaboration features, and advanced task management capabilities.

## ✅ Completed Features

### 1. **User Authentication & Role Management**
- **Sign Up / Login**: Users can create accounts and log in with email and password
- **Role Selection**: Three distinct roles during sign-up:
  - **Admin**: System administrator with full access
  - **Manager**: Project manager with team management capabilities
  - **Member**: Team member with limited access
- **JWT Token Authentication**: Secure token-based authentication with 2-day expiration
- **Password Security**: Bcrypt hashing for password storage

### 2. **Admin Dashboard** (`/admin-dashboard`)
**Features:**
- System-wide statistics:
  - Total users count
  - Total projects count
  - Total tasks count
  - Completed tasks count
  - Overdue tasks count
- **User Management**:
  - View all users
  - Update user roles (Admin, Manager, Member)
  - Delete users
  - User table with email and role information
- **Dashboard Analytics**:
  - Tasks grouped by status (To Do, In Progress, Done)
  - Tasks per user with completion statistics
  - Performance metrics for system monitoring

**Access**: Admin users only
**Routes**: `/api/v3/` endpoints

### 3. **Project Management** (`/projects`)
**Admin/Manager Features:**
- Create new projects with description
- View all projects with member lists
- **Team Member Management**:
  - Add members to projects
  - Remove members from projects
  - Bulk member management interface
- **Project Dashboard**:
  - Total tasks in project
  - Completed tasks count
  - Overdue tasks count
  - Team performance metrics

**Member Features:**
- View assigned projects only
- See project details
- View team members in project

**Routes**: `/api/v4/` endpoints

### 4. **Task Management System**

#### Task Creation (`/api/v2/create-task`)
**Fields:**
- Task Title (required)
- Description (required)
- Project ID (required)
- Assigned To (User ID, required)
- Priority (Low, Medium, High, Urgent)
- Due Date (required)

#### Task Statuses
- **To Do**: Initial status for new tasks
- **In Progress**: Task is being worked on
- **Done**: Task is completed

#### Task Features
- **Create Tasks**: Manager and Admin only
- **Update Task Status**: Manager, Admin, and assigned member
- **Update Task Details**: Manager and Admin only
- **Delete Tasks**: Manager and Admin only
- **Toggle Task Importance**: Assigned user and creator
- **View Tasks**: Role-based access

#### Task Filtering & Views
- **By Project**: Get all tasks in a project
- **By User**: Get tasks assigned to current user
- **By Status**: Filter tasks by status
- **Overdue Tasks**: Tasks past due date not yet completed
- **Dashboard Statistics**: Tasks by status, tasks per user, completion rates

**Routes**: `/api/v2/` endpoints

### 5. **Task Board - Kanban View** (`/tasks`)
- **Visual Task Management**:
  - Three columns: To Do, In Progress, Done
  - Drag-and-drop ready structure
  - Task cards display:
    - Title
    - Description
    - Priority level (color-coded)
    - Due date
    - Assigned user
- **Status Management**: Quick status change buttons (members with permissions)
- **Task Filtering**: Based on user role and project

### 6. **Dashboard Statistics** (`/project-dashboard/:projectId`)
**Displays:**
- Total tasks in project
- Completed tasks count
- Overdue tasks count
- Task completion percentage
- Tasks by status breakdown
- Team member performance:
  - Tasks per member
  - Completion percentage per member
  - Visual progress bars

### 7. **Role-Based Access Control (RBAC)**

#### **Admin Role**
- ✅ View and manage all users
- ✅ Create/delete users
- ✅ Manage user roles
- ✅ Create projects
- ✅ Create tasks in any project
- ✅ Delete tasks
- ✅ View system-wide statistics
- ✅ Delete projects

#### **Manager Role**
- ✅ Create and manage their own projects
- ✅ Add/remove team members
- ✅ Create and assign tasks
- ✅ Update task status
- ✅ Update task details
- ✅ Delete tasks in their projects
- ✅ View team performance metrics
- ✅ Cannot manage users or system settings

#### **Member Role**
- ✅ View assigned projects
- ✅ View assigned tasks
- ✅ Update task status (only for assigned tasks)
- ✅ Update task importance (for assigned tasks)
- ✅ Cannot create projects or tasks
- ✅ Cannot manage other users

### 8. **Frontend Components**

#### New Components Created:
1. **TaskManager.jsx** - Create tasks with full details
2. **TeamMemberManager.jsx** - Manage project members
3. **Sidebar.jsx** (Updated) - Role-based navigation
4. **Projects.jsx** - Project management interface
5. **AdminDashboard.jsx** - System administration
6. **ProjectDashboard.jsx** - Project analytics
7. **TasksPage.jsx** - Kanban board view

#### Updated Components:
- **App.js** - New routes added
- **utils/api.js** - Extended with new API methods
- **sidebar.css** - Added user role badge styling
- **styles.css** - Comprehensive dashboard and component styling

### 9. **Backend API Endpoints**

#### Admin Endpoints (`/api/v3/`)
```
GET    /get-all-users          - Get all users
POST   /create-user            - Create new user
PUT    /update-user-role       - Update user role
DELETE /delete-user            - Delete user
GET    /dashboard-stats        - Get system statistics
```

#### Project Endpoints (`/api/v4/`)
```
POST   /create-project         - Create project
GET    /get-projects           - Get user's projects
GET    /get-project/:id        - Get specific project
PUT    /add-members            - Add members to project
PUT    /remove-members         - Remove members from project
PUT    /update-project         - Update project details
GET    /team-performance/:id   - Get team performance
DELETE /delete-project         - Delete project
```

#### Task Endpoints (`/api/v2/`)
```
POST   /create-task            - Create task
GET    /get-project-tasks/:id  - Get project tasks
GET    /get-my-tasks           - Get user's tasks
GET    /get-tasks-by-status/:projectId/:status - Filter by status
GET    /get-overdue-tasks/:id  - Get overdue tasks
PUT    /update-task-status     - Update task status
PUT    /update-task            - Update task details
PUT    /toggle-importance      - Toggle task importance
DELETE /delete-task            - Delete task
GET    /get-dashboard-stats/:id - Get task statistics
```

### 10. **Navigation & Routing**

#### Public Routes:
- `/` - Landing page
- `/login` - User login
- `/signup` - User registration

#### Admin Routes:
- `/admin-dashboard` - System administration panel
- `/home` - Dashboard
- `/tasks` - Task board
- `/alltasks` - All tasks
- `/completedtasks` - Completed tasks
- `/incompletedtasks` - Incomplete tasks

#### Manager Routes:
- `/projects` - Project management
- `/home` - Dashboard
- `/tasks` - Task board
- (All member routes)

#### Member Routes:
- `/home` - Dashboard
- `/tasks` - Task board
- `/alltasks` - All tasks
- `/completedtasks` - Completed tasks
- `/incompletedtasks` - Incomplete tasks

### 11. **Database Models**

#### User Model
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  role: String (enum: admin, manager, member),
  tasks: [ObjectId],
  projects: [ObjectId],
  createdAt: Date
}
```

#### Project Model
```javascript
{
  projectName: String,
  description: String,
  manager: ObjectId (User),
  members: [ObjectId (User)],
  tasks: [ObjectId],
  status: String (enum: active, completed, on-hold),
  createdBy: ObjectId (User),
  createdAt: Date
}
```

#### Task Model
```javascript
{
  title: String,
  description: String,
  project: ObjectId (Project),
  assignedTo: ObjectId (User),
  priority: String (enum: low, medium, high, urgent),
  status: String (enum: To Do, In Progress, Done),
  dueDate: Date,
  isComplete: Boolean,
  isImportant: Boolean,
  createdBy: ObjectId (User),
  createdAt: Date
}
```

## 🎨 UI/UX Features

### Design Elements
- **Modern Dark Theme**: Beautiful gradient backgrounds
- **Glassmorphism Effects**: Semi-transparent panels with blur effects
- **Color Coding**:
  - Priority levels (Red for urgent, Orange for high, Yellow for medium, Green for low)
  - Status indicators (Green for complete, Yellow for open/in-progress)
  - Role badges (Different colors for different roles)

### Responsive Design
- Mobile-friendly layouts
- Tablet optimization
- Desktop-optimized views
- Grid-based responsive design

### Components Styling
- **Task Cards**: Hover effects, gradient backgrounds
- **Stat Cards**: Large numbers with labels
- **Kanban Columns**: Organized task display
- **Member Cards**: Performance indicators with progress bars
- **Tables**: Clean data presentation
- **Forms**: Styled input fields and buttons

## 🔒 Security Features
- JWT token authentication
- Password hashing with bcrypt
- Role-based authorization on all endpoints
- Protected API routes
- Token expiration (2 days)
- Input validation

## 📊 Performance Metrics
- Dashboard statistics with aggregation
- Team performance analytics
- Task completion rates
- Overdue task tracking
- User task distribution

## 🚀 How to Use

### For Admin Users:
1. Log in with admin credentials
2. Navigate to Admin Dashboard
3. Manage users and view system statistics
4. Create projects and assign managers

### For Manager Users:
1. Log in with manager credentials
2. Click "My Projects"
3. Create new projects and add team members
4. Create and assign tasks to team members
5. Monitor team performance

### For Member Users:
1. Log in with member credentials
2. View assigned projects and tasks
3. Update task status as you work
4. Mark tasks as important if needed

## 📝 Future Enhancements
- Real-time notifications
- File attachments for tasks
- Comments/discussion threads
- Time tracking
- Recurring tasks
- Calendar view
- Advanced filtering
- Export/reporting features

## 🛠️ Technology Stack
- **Frontend**: React, React Router, React Icons
- **Backend**: Express.js, Node.js
- **Database**: MongoDB
- **Authentication**: JWT, Bcrypt
- **API**: RESTful endpoints
- **Styling**: CSS3 with modern gradients and effects

---

**Version**: 1.0
**Last Updated**: May 2026
**Status**: ✅ Complete and Ready for Use
