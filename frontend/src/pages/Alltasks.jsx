import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getCurrentProjectTasks } from "../utils/tasks";

const Alltasks = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const data = await getCurrentProjectTasks();
            setTasks(data);
        } catch (error) {
            console.error('Error in fetchData:', error);
            setTasks([]);
        }
    }

    return (
            <div className="app-shell">
                <div className="sidebar-frame">
                    <Sidebar />
                </div>

                <main className="content-panel">
                    <div className="section-heading">
                        <span>Project Workspace</span>
                        <h1>All Tasks</h1>
                    </div>
                    <div className="tasks-grid">
                        {tasks.map((task) => (
                            <article key={task._id} className="task-card">
                                <h2>{task.title}</h2>
                                <p>{task.description || 'No description available.'}</p>
                                <span className={`status-pill ${task.isComplete ? 'is-complete' : 'is-open'}`}>
                                    {task.isComplete ? 'Completed' : 'Incomplete'}
                                </span>
                            </article>
                        ))}
                        {tasks.length === 0 && <div className="empty-state">No tasks found.</div>}
                    </div>
                </main>
            </div>
    );
}

export default Alltasks;
