import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { taskAPI } from '../utils/api';
import './styles.css';

export default function ProjectDashboard({ projectId }) {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDashboardStats();
    }, [projectId]);

    async function fetchDashboardStats() {
        try {
            setLoading(true);
            const data = await taskAPI.getDashboardStats(projectId);
            setStats(data.stats);
            setError("");
        } catch (err) {
            console.error('Error fetching dashboard stats:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="app-shell">
                <div className="sidebar-frame"><Sidebar /></div>
                <main className="content-panel">
                    <div className="empty-state">Loading dashboard...</div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="app-shell">
                <div className="sidebar-frame"><Sidebar /></div>
                <main className="content-panel">
                    <div className="empty-state is-danger">{error}</div>
                </main>
            </div>
        );
    }

    return (
        <div className="app-shell">
            <div className="sidebar-frame"><Sidebar /></div>
            <main className="content-panel">
                <div className="section-heading">
                    <span>Project Analytics</span>
                    <h1>Dashboard</h1>
                </div>

                {stats && (
                    <div className="dashboard-grid">
                        <div className="stat-card">
                            <div className="stat-number">{stats.totalTasks || 0}</div>
                            <div className="stat-label">Total Tasks</div>
                        </div>

                        <div className="stat-card is-success">
                            <div className="stat-number">{stats.completedTasks || 0}</div>
                            <div className="stat-label">Completed</div>
                        </div>

                        <div className="stat-card is-warning">
                            <div className="stat-number">{stats.overdueTasks || 0}</div>
                            <div className="stat-label">Overdue</div>
                        </div>

                        <div className="stat-card is-info">
                            <div className="stat-number">{stats.tasksPercentage}%</div>
                            <div className="stat-label">Completion Rate</div>
                        </div>
                    </div>
                )}

                {stats && stats.tasksByStatus && stats.tasksByStatus.length > 0 && (
                    <div className="dashboard-section">
                        <h2>Tasks by Status</h2>
                        <div className="status-breakdown">
                            {stats.tasksByStatus.map((item, idx) => (
                                <div key={idx} className="status-item">
                                    <span className="status-name">{item._id}</span>
                                    <span className="status-count">{item.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {stats && stats.tasksPerUser && stats.tasksPerUser.length > 0 && (
                    <div className="dashboard-section">
                        <h2>Team Member Performance</h2>
                        <div className="team-performance">
                            {stats.tasksPerUser.map((member, idx) => (
                                <div key={idx} className="member-card">
                                    <div className="member-info">
                                        <h3>{member.username}</h3>
                                        <p>{member.taskCount} tasks</p>
                                    </div>
                                    <div className="member-completion">
                                        <div className="completion-bar">
                                            <div
                                                className="completion-fill"
                                                style={{
                                                    width: `${member.completionPercentage || 0}%`
                                                }}
                                            ></div>
                                        </div>
                                        <span className="completion-percentage">
                                            {Math.round(member.completionPercentage || 0)}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
