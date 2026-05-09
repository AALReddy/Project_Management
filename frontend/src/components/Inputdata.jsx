// import React from "react";
// import './inputdata.css';
// import { IoMdCloseCircle } from "react-icons/io";

// const InputData = ({ InputDiv, setInputDiv }) => {
//   const handleClose = () => {
//     setInputDiv("hidden");
//   };

//   return (
//     <>
//       <div className={`${InputDiv} fixed top-0 left-0 bg-gray-800 opacity-80 h-screen w-full`}></div>    <div className={`${InputDiv} fixed top-0 left-0 flex items-center justify-center h-screen w-full `}>
//         <div className="w-full max-w-md sm:max-w-lg lg:max-w-2xl bg-gray-900 p-4 rounded">
//           <div className="text-xl flex justify-between items-end mb-4">
//             <button onClick={handleClose} className="text-gray-300 hover:text-gray-100">
//               <IoMdCloseCircle />
//             </button>
//           </div>
//           <input
//             type="text"
//             placeholder="Title"
//             name="title"
//             className="px-3 py-2 rounded w-full mb-4 bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
//           />
//           <textarea
//             name="desc"
//             cols="30"
//             rows="10"
//             placeholder="Description"
//             className="px-3 py-2 rounded w-full bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
//           />
//           <button className="px-3 py-2 bg-blue-400 rounded text-black text-xl font-semibold hover:text-white transition ease-in-out duration-300">
//             Submit
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default InputData;

import React, { useEffect, useState } from 'react';
import { IoMdCloseCircle } from 'react-icons/io';
import { apiFetch, taskAPI } from '../utils/api';
import { getCurrentProject, getCurrentUser } from '../utils/storage';

const InputData = ({ InputDiv, setInputDiv }) => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const project = getCurrentProject();
        const { users = [] } = await apiFetch("/api/v1/users");
        // Filter users if there is a project
        if (project?.members && users) {
          const memberIds = project.members.map((member) =>
            typeof member === "object" ? member._id : member
          );
          const filteredData = users.filter((user) =>
            memberIds.includes(user._id)
          );
          setMembers(filteredData);
        } else {
          setMembers(users);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);  
  const [newTask, setNewTask] = useState('');
  const [description, setDescription] = useState('');
  const [member, setMember] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [error, setError] = useState('');
  const handleClose = () => {
    setInputDiv(false);
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    setError('');
    const project = getCurrentProject();
    const user = getCurrentUser();
    if (!project?._id || !user?.id) {
      setError('Project or user context is missing.');
      return;
    }
    const formData={
      title:newTask,
      description,
      projectId: project._id,
      assignedToId: member,
      dueDate,
      priority
    }
    if (newTask.trim() && description.trim() && member && dueDate) {
        await taskAPI.createTask(formData);
      setNewTask('');
      setDescription('');
      setMember('');
      setDueDate('');
      setPriority('medium');
      handleClose();
      window.location.reload();
    } else {
      setError('Please fill all required fields.');
    }
  };
function handleClick1(e){
  setMember(e.target.value);
}
  return (
    <>
      {!InputDiv ? null : (
      <>
      <div className="fixed top-0 left-0 bg-gray-800 opacity-80 h-screen w-full"></div>
      <div className="modal-layer">
        <div className="modal-card">
          <div className="modal-header">
            <h2>Create Task</h2>
            <button onClick={handleClose} className="modal-close" type="button">
              <IoMdCloseCircle />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="modern-form">
            <input
              type="text"
              placeholder="Title"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <select value={member} onChange={handleClick1}>
              <option value="">Select Assignee</option>
              {
                members.map((data) =>
               <option key={data._id} value={data._id} >{data.username}</option>
                )
              }
            </select>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="primary-action">Submit</button>
          </form>
        </div>
      </div>
      </>
      )}
    </>
  );
};

export default InputData; 
