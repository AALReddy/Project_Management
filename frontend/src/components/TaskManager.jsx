import React, { useState, useEffect } from 'react';
import { taskAPI, projectAPI } from '../utils/api';
import '../components/inputdata.css';

export default function TaskManager({ projectId, onClose }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        assignedToId: ''
    });
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    useEffect(() => {
        fetchTeamMembers();
    }, [projectId]);

    async function fetchTeamMembers() {
        try {
            const project = await projectAPI.getProjectById(projectId);
            setTeamMembers(project.project.members || []);
        } catch (err) {
            console.error('Error fetching team members:', err);
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        
        if (!formData.title || !formData.description || !formData.dueDate || !formData.assignedToId) {
            setError("All fields are required");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const taskData = {
                title: formData.title,
                description: formData.description,
                projectId,
                assignedToId: formData.assignedToId,
                priority: formData.priority,
                dueDate: formData.dueDate
            };

            await taskAPI.createTask(taskData);
            setSuccess("Task created successfully!");
            
            // Reset form
            setFormData({
                title: '',
                description: '',
                priority: 'medium',
                dueDate: '',
                assignedToId: ''
            });

            // Close after 1.5 seconds
            setTimeout(() => {
                if (onClose) onClose();
            }, 1500);
        } catch (err) {
            setError(err.message || "Failed to create task");
            console.error('Error creating task:', err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="input-div">
            <div className="input-content">
                <h2>Create New Task</h2>
                
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Task Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter task title"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description *</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter task description"
                            rows="4"
                            required
                        ></textarea>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Priority</label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Due Date *</label>
                            <input
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Assign To *</label>
                        <select
                            name="assignedToId"
                            value={formData.assignedToId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select team member</option>
                            {teamMembers.map(member => (
                                <option key={member._id} value={member._id}>
                                    {member.username}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-actions">
                        <button type="submit" disabled={loading} className="btn-primary">
                            {loading ? 'Creating...' : 'Create Task'}
                        </button>
                        {onClose && (
                            <button type="button" onClick={onClose} className="btn-secondary">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
