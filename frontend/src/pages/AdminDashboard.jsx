import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { adminAPI } from '../utils/api';
import { getCurrentUser } from '../utils/storage';
import './styles.css';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [activeTab, setActiveTab] = useState("stats");
    const [editingUser, setEditingUser] = useState(null);
    const [newRole, setNewRole] = useState("");
    const user = getCurrentUser();

    useEffect(() => {
        if (user?.role !== 'admin') {
            window.location.href = '/';
            return;
        }
        fetchData();
    }, [user]);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(""), 3000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(""), 4000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    async function fetchData() {
        try {
            setLoading(true);
            setError("");
            const [statsData, usersData] = await Promise.all([
                adminAPI.getDashboardStats(),
                adminAPI.getAllUsers()
            ]);
            setStats(statsData?.stats || null);
            setUsers(usersData?.users || []);
        } catch (err) {
            console.error('Error fetching data:', err);
            // Don't block the UI - try to load what we can
            setStats(null);
            setUsers([]);
            // Only show error as a notification, not blocking
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdateRole(userId, role) {
        try {
            await adminAPI.updateUserRole(userId, role);
            setSuccess("User role updated successfully");
            setEditingUser(null);
            fetchData();
        } catch (err) {
            setError(err.message || "Failed to update user role");
        }
    }

    async function handleDeleteUser(userId) {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await adminAPI.deleteUser(userId);
                setSuccess("User deleted successfully");
                fetchData();
            } catch (err) {
                setError(err.message || "Failed to delete user");
            }
        }
    }

    if (loading) {
        return (
            <div className="app-shell">
                <div className="sidebar-frame"><Sidebar /></div>
                <main className="content-panel">
                    <div className="empty-state">Loading admin dashboard...</div>
                </main>
            </div>
        );
    }

    return (
        <div className="app-shell">
            <div className="sidebar-frame"><Sidebar /></div>
            <main className="content-panel">
                {error && (
                    <div className="alert alert-error">
                        {error}
                        <button onClick={() => setError("")} style={{ marginLeft: '10px' }}>×</button>
                    </div>
                )}
                {success && (
                    <div className="alert alert-success">
                        {success}
                        <button onClick={() => setSuccess("")} style={{ marginLeft: '10px' }}>×</button>
                    </div>
                )}
                <div className="section-heading">
                    <span>System Administration</span>
                    <h1>Admin Dashboard</h1>
                </div>

                <div className="admin-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
                        onClick={() => setActiveTab('stats')}
                    >
                        Statistics
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        Users ({users.length})
                    </button>
                </div>

                {activeTab === 'stats' && stats && (
                    <>
                        <div className="stats-grid-admin">
                            <div className="stat-card">
                                <div className="stat-number">{stats.totalUsers || 0}</div>
                                <div className="stat-label">Total Users</div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-number">{stats.totalProjects || 0}</div>
                                <div className="stat-label">Total Projects</div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-number">{stats.totalTasks || 0}</div>
                                <div className="stat-label">Total Tasks</div>
                            </div>

                            <div className="stat-card is-success">
                                <div className="stat-number">{stats.completedTasks || 0}</div>
                                <div className="stat-label">Completed Tasks</div>
                            </div>

                            <div className="stat-card is-warning">
                                <div className="stat-number">{stats.overdueTasks || 0}</div>
                                <div className="stat-label">Overdue Tasks</div>
                            </div>
                        </div>

                        {stats.tasksByStatus && (
                            <div className="dashboard-section">
                                <h2>Tasks by Status</h2>
                                <div className="status-breakdown">
                                    {stats.tasksByStatus.map((item, idx) => (
                                        <div key={idx} className="status-item">
                                            <span>{item._id}</span>
                                            <span className="count">{item.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {stats.tasksPerUser && (
                            <div className="dashboard-section">
                                <h2>Tasks Per User</h2>
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Username</th>
                                            <th>Task Count</th>
                                            <th>Completed</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.tasksPerUser.map((item, idx) => (
                                            <tr key={idx}>
                                                <td>{item.username}</td>
                                                <td>{item.taskCount}</td>
                                                <td>{item.completedCount || 0}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'users' && (
                    <div className="users-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u._id}>
                                        <td>{u.username}</td>
                                        <td>{u.email}</td>
                                        <td>
                                            {editingUser === u._id ? (
                                                <select
                                                    value={newRole}
                                                    onChange={(e) => setNewRole(e.target.value)}
                                                >
                                                    <option value="admin">Admin</option>
                                                    <option value="manager">Manager</option>
                                                    <option value="member">Member</option>
                                                </select>
                                            ) : (
                                                <span className={`role-badge role-${u.role}`}>
                                                    {u.role}
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            {editingUser === u._id ? (
                                                <>
                                                    <button
                                                        className="btn-small"
                                                        onClick={() => handleUpdateRole(u._id, newRole)}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        className="btn-small"
                                                        onClick={() => setEditingUser(null)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        className="btn-small"
                                                        onClick={() => {
                                                            setEditingUser(u._id);
                                                            setNewRole(u.role);
                                                        }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="btn-small btn-danger"
                                                        onClick={() => handleDeleteUser(u._id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}
