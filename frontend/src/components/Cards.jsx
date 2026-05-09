// components/Cards.js
import React, { useCallback, useEffect, useState } from 'react';
import { IoAddCircle } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";   // Edit icon
import { MdDelete } from "react-icons/md"; // Delete icon
import InputData from './Inputdata';
import EditPopup from './EditPopup';
import {FaCheck} from 'react-icons/fa6'
import { apiFetch } from '../utils/api';
import { getCurrentProjectTasks } from '../utils/tasks';
import { getCurrentUser } from '../utils/storage';
const Cards = ({ InputDiv, setInputDiv }) => {
  let user = getCurrentUser();
  let [tasks, setTasks] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const fetchData = useCallback(async function fetchData() {
    try {
      const data = await getCurrentProjectTasks({ onlyCurrentUser: user?.role !== "manager" });
      setTasks(data);
    } catch (error) {
      console.error('Error in fetchData:', error);
      setTasks([]);
    }
  }, [user?.role]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
async function handleStatusChange(task){
  await apiFetch('/api/v2/changestatus', {
    method: 'PUT',
    body: JSON.stringify({ id: task._id }),
  });
  await fetchData()
}
  // Handle Edit Button Click
  const handleEdit = (task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  // Handle Delete Button Click
  const handleDelete = async (task) => {
    await apiFetch('/api/v2/delete-task', {
      method: 'DELETE',
      body: JSON.stringify({ taskId: task._id }),
    });
    await fetchData()
  };

  return (
    <div className="task-board">
      <div className="section-heading">
        <span>{user?.role === "manager" ? "Manager Control" : "My Workspace"}</span>
        <h1>Your Tasks</h1>
      </div>

      <div className="tasks-grid">
        {tasks.map((task) => (
          <article
            key={task._id}
            className="task-card"
          >
            <h2>{task.title}</h2>
            <p>{task.description || 'No description available.'}</p>
            <div className="task-card-footer">
              <span className={`status-pill ${task.isComplete ? 'is-complete' : 'is-open'}`}>
                {task.isComplete?"Completed":"Incomplete"}
              </span>
            </div>

           {
user && (user.role==="manager" || user.role==="admin") &&
<div className="task-actions">
<button
  className="icon-action"
  onClick={() => handleEdit(task)}
  title="Edit task"
>
  <FaEdit />
</button>

<button
  className="icon-action is-danger"
  onClick={() => handleDelete(task)}
  title="Delete task"
>
  <MdDelete />
</button>
<button className="icon-action is-success" onClick={()=>handleStatusChange(task)} title="Toggle completion">
  <FaCheck />
</button>
</div>
           }
          </article>
        ))}
        {tasks.length === 0 && (
          <div className="empty-state">No tasks found for this project.</div>
        )}

        {localStorage.getItem('role') === 'manager' && (
          <button
            className="add-task-card"
            onClick={() => setInputDiv(true)}
          >
            <IoAddCircle />
            <span>Add Task</span>
          </button>
        )}
      </div>

      <InputData InputDiv={InputDiv} setInputDiv={setInputDiv} />
      <EditPopup InputDiv={isEditModalOpen} setInputDiv={setIsEditModalOpen} task={editingTask} onUpdated={fetchData} />
    </div>
  );
}

export default Cards;
