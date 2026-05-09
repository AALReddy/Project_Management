# AstraTrack - Developer Quick Reference Guide

## 🚀 Quick Commands

### Backend Commands
```bash
# Install dependencies
cd backend && npm install

# Start development server
npm start

# Server will run on http://localhost:8800

# Environment variables needed (.env file)
DB_USER_NAME=your_username
DB_PASSWORD=your_password
DB_NAME=project_manager
DB_CLUSTER=cluster0.5oqpm.mongodb.net
JWT_SECRET=your_secret_key
PORT=8800
```

### Frontend Commands
```bash
# Install dependencies
cd frontend && npm install

# Start development server
npm start

# Frontend will run on http://localhost:3000

# Environment variables needed (.env file)
REACT_APP_API_BASE_URL=http://localhost:8800
```

---

## 🔑 Test User Credentials

Create these users for testing:

### Admin User
- **Username**: admin_user
- **Email**: admin@example.com
- **Password**: admin123456
- **Role**: Admin
- **Created by**: Signing up with Admin role selected

### Manager User
- **Username**: manager_user
- **Email**: manager@example.com
- **Password**: manager123
- **Role**: Manager
- **Created by**: Signing up with Manager role selected

### Member User
- **Username**: member_user
- **Email**: member@example.com
- **Password**: member123
- **Role**: Member
- **Created by**: Signing up with Member role selected

---

## 📋 API Testing URLs

### Local Development
```
API Base: http://localhost:8800
Frontend: http://localhost:3000
```

### Authentication
```
POST http://localhost:8800/api/v1/sign-in
POST http://localhost:8800/api/v1/log-in
```

### Admin APIs
```
GET    http://localhost:8800/api/v3/get-all-users
GET    http://localhost:8800/api/v3/dashboard-stats
POST   http://localhost:8800/api/v3/create-user
PUT    http://localhost:8800/api/v3/update-user-role
DELETE http://localhost:8800/api/v3/delete-user
```

### Project APIs
```
POST   http://localhost:8800/api/v4/create-project
GET    http://localhost:8800/api/v4/get-projects
GET    http://localhost:8800/api/v4/get-project/:id
PUT    http://localhost:8800/api/v4/add-members
PUT    http://localhost:8800/api/v4/remove-members
GET    http://localhost:8800/api/v4/team-performance/:id
```

### Task APIs
```
POST   http://localhost:8800/api/v2/create-task
GET    http://localhost:8800/api/v2/get-project-tasks/:id
GET    http://localhost:8800/api/v2/get-my-tasks
GET    http://localhost:8800/api/v2/get-tasks-by-status/:projectId/:status
GET    http://localhost:8800/api/v2/get-overdue-tasks/:id
PUT    http://localhost:8800/api/v2/update-task-status
PUT    http://localhost:8800/api/v2/update-task
DELETE http://localhost:8800/api/v2/delete-task
```

---

## 🧪 Testing Workflow

### Test Admin Features
1. Create account with Admin role
2. Login and navigate to `/admin-dashboard`
3. Test user management (create, update, delete)
4. View system statistics
5. Create projects as admin

### Test Manager Features
1. Create account with Manager role
2. Login and navigate to `/projects`
3. Create a new project
4. Add members to project
5. Create tasks and assign to members
6. View team performance

### Test Member Features
1. Create account with Member role
2. Login and view dashboard
3. View assigned projects (after manager assigns)
4. Go to `/tasks` and view task board
5. Update task status
6. Mark tasks as important

---

## 🐛 Common Issues & Solutions

### Issue: MongoDB Connection Failed
**Solution:**
1. Check `.env` file has correct credentials
2. Verify cluster IP whitelist in MongoDB Atlas
3. Ensure network connection is active
4. Try: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`

### Issue: Frontend Can't Connect to Backend
**Solution:**
1. Verify backend is running on port 8800
2. Check `.env` has `REACT_APP_API_BASE_URL=http://localhost:8800`
3. Clear browser cache and reload
4. Check for CORS issues in browser console

### Issue: JWT Token Expired
**Solution:**
1. Token expires after 2 days
2. User needs to login again
3. New token is generated on login
4. Check token expiration in auth middleware

### Issue: Pages Show Empty/404
**Solution:**
1. Ensure routes are added in `App.js`
2. Check component imports are correct
3. Verify file paths match exactly
4. Clear npm cache: `npm cache clean --force`

### Issue: Styles Not Loading
**Solution:**
1. Check CSS file paths in imports
2. Verify class names match CSS
3. Clear browser cache
4. Restart dev server with `npm start`

### Issue: Can't Create Tasks
**Solution:**
1. Ensure you're logged in as Manager or Admin
2. Project must exist first
3. Team members must be added to project
4. All task fields must be filled

### Issue: Members Can't See Projects
**Solution:**
1. Manager must add them to project via "Manage Team"
2. They will only see projects they're added to
3. Refresh page to see updated projects
4. Check user role is set to "member"

---

## 📂 File Structure Reference

### Backend Key Files
```
backend/
├── app.js                 # Main server file
├── routes/
│   ├── auth.js           # Auth middleware
│   ├── user.js           # User endpoints
│   ├── task.js           # Task endpoints
│   ├── admin.js          # Admin endpoints
│   └── project.js        # Project endpoints
├── models/
│   ├── user.js           # User schema
│   ├── task.js           # Task schema
│   └── project.js        # Project schema
└── package.json
```

### Frontend Key Files
```
frontend/src/
├── components/
│   ├── Sidebar.jsx       # Navigation sidebar
│   ├── TaskManager.jsx   # Create tasks
│   ├── TeamMemberManager.jsx
│   ├── Login.jsx
│   └── Signin.jsx
├── pages/
│   ├── AdminDashboard.jsx
│   ├── Projects.jsx
│   ├── ProjectDashboard.jsx
│   ├── TasksPage.jsx
│   └── Dash.jsx
├── utils/
│   ├── api.js            # API functions
│   ├── storage.js        # Local storage
│   └── tasks.js          # Task utilities
└── App.js
```

---

## 🔄 Common Development Tasks

### Adding a New User Role
1. Update User model in `backend/models/user.js`
2. Add to enum: `enum: ['admin', 'manager', 'member', 'newRole']`
3. Add role check in middleware
4. Update Signin options in `frontend/components/Signin.jsx`
5. Add routes based on role in `frontend/src/App.js`

### Creating New API Endpoint
1. Create route in `backend/routes/filename.js`
2. Add authentication check if needed
3. Register route in `backend/app.js`
4. Create API function in `frontend/utils/api.js`
5. Use in component with `apiFetch()` or specific API function

### Adding New Page
1. Create component in `frontend/src/pages/`
2. Import in `frontend/src/App.js`
3. Add route in `<Routes>`
4. Add navigation link in Sidebar if needed
5. Apply styling in `styles.css`

---

## 🔐 Security Reminders

### Backend
- Always validate input
- Check user role before operations
- Use `.env` for sensitive data
- Never expose passwords
- Validate JWT tokens
- Use CORS properly
- Sanitize database queries

### Frontend
- Store token securely
- Clear sensitive data on logout
- Validate user input
- Don't expose API keys
- Use HTTPS in production
- Implement rate limiting

---

## 📊 Database Queries Reference

### Check All Users
```bash
# In MongoDB
db.users.find()
```

### Check All Projects
```bash
# In MongoDB
db.projects.find()
```

### Check All Tasks
```bash
# In MongoDB
db.tasks.find()
```

### Find Tasks for Project
```bash
# In MongoDB
db.tasks.find({ project: ObjectId("projectId") })
```

### Find Tasks for User
```bash
# In MongoDB
db.tasks.find({ assignedTo: ObjectId("userId") })
```

---

## 🚢 Deployment Checklist

Before going to production:

- [ ] Update `.env` with production credentials
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS
- [ ] Update API URL for production
- [ ] Set secure JWT secret (long random string)
- [ ] Configure MongoDB whitelist
- [ ] Test all user roles
- [ ] Verify all endpoints work
- [ ] Test error handling
- [ ] Check responsive design
- [ ] Set up error logging
- [ ] Configure backup strategies
- [ ] Set up monitoring

---

## 📞 Useful Resources

### MongoDB
- Connection String: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`
- Create cluster: https://www.mongodb.com/cloud/atlas
- Compass: Visual database manager

### JWT
- Generate secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Expiration format: '2d', '7d', '30d'
- Token stored in: localStorage under 'token' key

### React
- Router docs: https://reactrouter.com
- Hooks: useState, useEffect, useContext
- Icons: react-icons library

### Express
- Middleware order matters
- Use router for route grouping
- Error handling in last middleware
- CORS before routes

---

## 🎯 Next Steps for Enhancement

1. **Real-time Features**
   - Add Socket.io for live updates
   - Real-time notifications

2. **File Management**
   - Attach files to tasks
   - Document storage

3. **Advanced Analytics**
   - Charts and graphs
   - Export reports
   - Time tracking

4. **Notifications**
   - Email notifications
   - In-app notifications
   - Task reminders

5. **Mobile App**
   - React Native version
   - Cross-platform support

---

**Version**: 1.0.0  
**Last Updated**: May 2026  
**Status**: Production Ready
