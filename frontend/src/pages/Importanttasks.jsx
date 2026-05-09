import React, { useEffect, useState } from 'react';
import './styles.css';
import Sidebar from '../components/Sidebar';
import { getCurrentProjectTasks } from '../utils/tasks';

const ImportantTasks = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getCurrentProjectTasks({ onlyCurrentUser: true });
                setTasks(data.filter((task) => task.important));
            } catch (error) {
                console.error('Error loading important tasks:', error);
                setTasks([]);
            }
        }

        fetchData();
    }, []);

    return (
        <div className="app-shell">
            <div className="sidebar-frame">
                <Sidebar />
            </div>

            <main className="content-panel">
                <div className="section-heading">
                    <span>Priority Board</span>
                    <h1>Important Tasks</h1>
                </div>
                <div className="tasks-grid">
                    {tasks.map((task) => (
                        <article key={task._id} className="task-card">
                            <h2>{task.title}</h2>
                            <p>{task.desc || 'No description available.'}</p>
                            <span className={`status-pill ${task.complete ? 'is-complete' : 'is-open'}`}>
                                {task.complete ? 'Completed' : 'Incomplete'}
                            </span>
                        </article>
                    ))}
                    {tasks.length === 0 && <div className="empty-state">No important tasks found.</div>}
                </div>
            </main>
        </div>
    );
}

export default ImportantTasks;
