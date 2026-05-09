import React, { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';

export default function AddProject() {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('active');
  let [users,setUser]=useState([])
  let [managers,setManagers]=useState([])
  let [team,setTeam]=useState([])
  const [managerId, setManagerId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
    useEffect(()=>{
        fetchData()
    },[])
    async function fetchData(){
        let data=await apiFetch("/api/v1/users",{
            method:"GET"
        })
        const allUsers = Array.isArray(data.users) ? data.users : [];
        setUser(allUsers)
        setManagers(allUsers.filter((user) => user.role === "manager"))
    }
  const handleSubmit =  async (event) => {
    event.preventDefault();
    
    // Clear any previous error or success messages
    setError('');
    setSuccess('');
const formData={
    projectName,
    description,
    status,
    managerId,
    members:team
}
    try {
      await apiFetch('/api/v4/create-project', {
        method:"POST",
        body:JSON.stringify(formData)
        
      });
      setSuccess('Project added successfully!');
      setProjectName('');
      setDescription('');
      setStatus('active');
      setManagerId('');
      setTeam([]);
    } catch (err) {
      setError(err.message || 'Failed to add project. Please try again.');
    }
  };

  function handleTeamChange(event){
    const selected = Array.from(event.target.selectedOptions, (option) => option.value);
    setTeam(selected)
  }

  const teamMemberOptions = users.filter((user) => {
    const normalizedRole = (user.role || "").toLowerCase();
    const isMember = normalizedRole === "member" || normalizedRole === "team member";
    return isMember && user._id !== managerId;
  });
  return (
    <div className="add-project-page">
      <header className="page-header">
        <h1>Add New Project</h1>
      </header>

      <section className="add-project-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="projectName">Project Name:</label>
            <input
              type="text"
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="manager">Manager:</label>
            <select
              id="manager"
              value={managerId}
              onChange={(e) => setManagerId(e.target.value)}
              required
            >
              <option value="">Select manager</option>
              {managers.map((data) => (
                <option key={data._id} value={data._id}>
                  {data.username} ({data.email})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="team">Team Members:</label>
            <select
              id="team"
              multiple
              size={Math.min(6, Math.max(3, teamMemberOptions.length || 3))}
              value={team}
              onChange={handleTeamChange}
            >
              {teamMemberOptions.length === 0 ? (
                <option value="" disabled>No team members available</option>
              ) : (
                teamMemberOptions.map((data) => (
                  <option key={data._id} value={data._id}>
                    {data.username} ({data.email})
                  </option>
                ))
              )}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="status">Status:</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="active">Active</option>
              <option value="on-hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <button type="submit" className="submit-button">Add Project</button>
        </form>
        
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </section>
    </div>
  );
}
