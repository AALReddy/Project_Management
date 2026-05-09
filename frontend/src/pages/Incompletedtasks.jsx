import React, { useEffect, useState } from 'react';
// import Cards from '../components/Cards';
import './styles.css';
import Sidebar from '../components/Sidebar';
import { getCurrentProjectTasks } from '../utils/tasks';

const IncompletedTasks = () => {
    let [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
    
      async function fetchData() {
        try {
          const data = await getCurrentProjectTasks({ onlyCurrentUser: true });
          setTasks(data.filter((task) => !task.isComplete));
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
                <span>Needs Attention</span>
                <h1>Incomplete Tasks</h1>
            </div>
            <div className="tasks-grid">
                {tasks.map((task) => {
               
              return  <article key={task._id} className="task-card">
                        <h2>{task.title}</h2>
                        <p>{task.description || 'No description available.'}</p>
                        <span className="status-pill is-open">
                            {task.isComplete ? 'Completed' : 'Incomplete'}
                        </span>
                    </article>
})}
                {tasks.length === 0 && <div className="empty-state">No incomplete tasks found.</div>}
            </div>
        </main>
    </div>
    );
}

export default IncompletedTasks;
