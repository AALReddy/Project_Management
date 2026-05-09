import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { taskAPI, projectAPI } from '../utils/api';
import { getCurrentUser } from '../utils/storage';
import './styles.css';

const TaskBoard = ({ projectId }) => {
    const [tasks, setTasks] = useState({
        'To Do': [],
        'In Progress': [],
        'Done': []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const user = getCurrentUser();

    useEffect(() => {
        if (projectId) {
            fetchTasks();
        }
    }, [projectId]);

    async function fetchTasks() {
        try {
            setLoading(true);
            const data = await taskAPI.getProjectTasks(projectId);
            
            const groupedTasks = {
                'To Do': [],
                'In Progress': [],
                'Done': []
            };

            data.tasks.forEach(task => {
                if (groupedTasks[task.status]) {
                    groupedTasks[task.status].push(task);
                }
            });

            setTasks(groupedTasks);
        } catch (err) {
            console.error('Error fetching tasks:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function updateTaskStatus(taskId, newStatus) {
        try {
            await taskAPI.updateTaskStatus(taskId, newStatus);
            fetchTasks();
        } catch (err) {
            console.error('Error updating task status:', err);
            setError(err.message);
        }
    }

    if (loading) {
        return <div className="empty-state">Loading tasks...</div>;
    }

    return (
        <div className="task-board">
            {error && <div className="error-message">{error}</div>}
            
            <div className="kanban-board">
                {['To Do', 'In Progress', 'Done'].map(status => (
                    <div key={status} className="kanban-column">
                        <h3 className="column-title">
                            {status}
                            <span className="task-count">{tasks[status].length}</span>
                        </h3>
                        
                        <div className="tasks-column">
                            {tasks[status].map(task => (
                                <div key={task._id} className="task-card-board">
                                    <h4>{task.title}</h4>
                                    <p>{task.description}</p>
                                    
                                    <div className="task-meta">
                                        <span className={`priority priority-${task.priority}`}>
                                            {task.priority}
                                        </span>
                                        <span className="due-date">
                                            {new Date(task.dueDate).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {task.assignedTo && (
                                        <div className="assigned-to">
                                            Assigned to: {task.assignedTo.username}
                                        </div>
                                    )}

                                    {user?.role !== 'member' && (
                                        <div className="status-actions">
                                            {status !== 'To Do' && (
                                                <button
                                                    onClick={() => updateTaskStatus(task._id, 'To Do')}
                                                    className="btn-xs"
                                                >
                                                    To Do
                                                </button>
                                            )}
                                            {status !== 'In Progress' && (
                                                <button
                                                    onClick={() => updateTaskStatus(task._id, 'In Progress')}
                                                    className="btn-xs"
                                                >
                                                    In Progress
                                                </button>
                                            )}
                                            {status !== 'Done' && (
                                                <button
                                                    onClick={() => updateTaskStatus(task._id, 'Done')}
                                                    className="btn-xs is-success"
                                                >
                                                    Done
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function TasksPage() {
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchProjects();
    }, []);

    async function fetchProjects() {
        try {
            setLoading(true);
            const data = await projectAPI.getProjects();
            const availableProjects = data.projects || [];
            if (availableProjects.length > 0) {
                setSelectedProjectId(availableProjects[0]._id);
            } else {
                setSelectedProjectId(null);
            }
        } catch (err) {
            console.error('Error fetching projects:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="app-shell">
            <div className="sidebar-frame"><Sidebar /></div>
            <main className="content-panel">
                <div className="section-heading">
                    <span>Task Management</span>
                    <h1>Tasks Kanban Board</h1>
                </div>

                {loading && <div className="empty-state">Loading tasks...</div>}
                {error && <div className="empty-state is-danger">{error}</div>}
                
                {!loading && !error && selectedProjectId && (
                    <TaskBoard projectId={selectedProjectId} />
                )}
                {!loading && !error && !selectedProjectId && (
                    <div className="empty-state">No projects available for task view.</div>
                )}
            </main>
        </div>
    );
}
