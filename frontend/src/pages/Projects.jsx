import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TaskManager from '../components/TaskManager';
import TeamMemberManager from '../components/TeamMemberManager';
import { projectAPI, taskAPI } from '../utils/api';
import { getCurrentUser } from '../utils/storage';
import './styles.css';

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showTaskManager, setShowTaskManager] = useState(false);
    const [showTeamManager, setShowTeamManager] = useState(false);
    const [projectStats, setProjectStats] = useState(null);
    const user = getCurrentUser();

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (selectedProject) {
            fetchProjectStats();
        }
    }, [selectedProject]);

    async function fetchProjects() {
        try {
            setLoading(true);
            const data = await projectAPI.getProjects();
            setProjects(data.projects || []);
            if (data.projects && data.projects.length > 0) {
                setSelectedProject(data.projects[0]);
            }
        } catch (err) {
            console.error('Error fetching projects:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function fetchProjectStats() {
        try {
            if (user?.role === 'manager') {
                const stats = await taskAPI.getDashboardStats(selectedProject._id);
                setProjectStats(stats.stats);
            }
        } catch (err) {
            console.error('Error fetching project stats:', err);
        }
    }

    if (loading) {
        return (
            <div className="app-shell">
                <div className="sidebar-frame"><Sidebar /></div>
                <main className="content-panel">
                    <div className="empty-state">Loading projects...</div>
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
                    <span>Manage Projects</span>
                    <h1>Your Projects</h1>
                </div>

                {projects.length === 0 ? (
                    <div className="empty-state">No projects found</div>
                ) : (
                    <div className="projects-container">
                        <div className="projects-sidebar">
                            {projects.map(project => (
                                <div
                                    key={project._id}
                                    className={`project-item ${selectedProject?._id === project._id ? 'active' : ''}`}
                                    onClick={() => setSelectedProject(project)}
                                >
                                    <h3>{project.projectName}</h3>
                                    <p className="project-members">
                                        {project.members?.length || 0} members
                                    </p>
                                </div>
                            ))}
                        </div>

                        {selectedProject && (
                            <div className="project-details">
                                <div className="project-header">
                                    <h2>{selectedProject.projectName}</h2>
                                    <p>{selectedProject.description}</p>
                                </div>

                                {user?.role === 'manager' && (
                                    <>
                                        <div className="project-actions">
                                            <button
                                                className="btn-primary"
                                                onClick={() => setShowTaskManager(true)}
                                            >
                                                + Add Task
                                            </button>
                                            <button
                                                className="btn-secondary"
                                                onClick={() => setShowTeamManager(true)}
                                            >
                                                Manage Team
                                            </button>
                                        </div>

                                        {projectStats && (
                                            <div className="stats-grid">
                                                <div className="stat">
                                                    <div className="stat-value">
                                                        {projectStats.totalTasks || 0}
                                                    </div>
                                                    <div className="stat-label">Total Tasks</div>
                                                </div>
                                                <div className="stat is-success">
                                                    <div className="stat-value">
                                                        {projectStats.completedTasks || 0}
                                                    </div>
                                                    <div className="stat-label">Completed</div>
                                                </div>
                                                <div className="stat is-warning">
                                                    <div className="stat-value">
                                                        {projectStats.overdueTasks || 0}
                                                    </div>
                                                    <div className="stat-label">Overdue</div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}

                                <div className="team-section">
                                    <h3>Team Members ({selectedProject.members?.length || 0})</h3>
                                    <div className="members-list-view">
                                        {selectedProject.members && selectedProject.members.length > 0 ? (
                                            selectedProject.members.map(member => (
                                                <div key={member._id} className="member-card-small">
                                                    <span className="member-name">{member.username}</span>
                                                    <span className="member-email">{member.email}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="no-members">No team members assigned</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {showTaskManager && selectedProject && (
                    <TaskManager
                        projectId={selectedProject._id}
                        onClose={() => {
                            setShowTaskManager(false);
                            fetchProjects();
                        }}
                    />
                )}

                {showTeamManager && selectedProject && (
                    <TeamMemberManager
                        projectId={selectedProject._id}
                        onClose={() => {
                            setShowTeamManager(false);
                            fetchProjects();
                        }}
                    />
                )}
            </main>
        </div>
    );
}
