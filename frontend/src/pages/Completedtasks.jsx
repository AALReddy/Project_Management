import React, { useState, useEffect } from "react";
// import Cards from "../components/Cards";
// import axios from "axios";
import './styles.css';
import Sidebar from "../components/Sidebar";
import { getCurrentProjectTasks } from "../utils/tasks";

const CompletedTasks = () => {
    let [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
    
      async function fetchData() {
        try {
          const data = await getCurrentProjectTasks({ onlyCurrentUser: true });
          setTasks(data.filter((task) => task.isComplete));
        } catch (error) {
          console.error('Error in fetchData:', error);
          setTasks([]);
        }
      }
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await axios.get(
    //                 "http://localhost:1000/api/v2/get-complete-tasks",
    //                 { headers }
    //             );
    //             setData(response.data.data); // Assuming response.data.data is an array
    //         } catch (error) {
    //             console.error("Error fetching data", error);
    //         }
    //     };

    //     fetchData();
    // }, []); // Empty dependency array to fetch data once on mount

    return (
        <div className="app-shell">
        <div className="sidebar-frame">
            <Sidebar />
        </div>

        <main className="content-panel">
            <div className="section-heading">
                <span>Finished Work</span>
                <h1>Completed Tasks</h1>
            </div>
            <div className="tasks-grid">
                {tasks.map((task) => {
               
              return  <article key={task._id} className="task-card">
                        <h2>{task.title}</h2>
                        <p>{task.description || 'No description available.'}</p>
                        <span className="status-pill is-complete">
                            {task.isComplete ? 'Completed' : 'Incomplete'}
                        </span>
                    </article>
})}
                {tasks.length === 0 && <div className="empty-state">No completed tasks found.</div>}
            </div>
        </main>
    </div>
    );
}

export default CompletedTasks;
