import React, { useState, useEffect } from 'react';
import { apiFetch, projectAPI } from '../utils/api';
import './inputdata.css';

export default function TeamMemberManager({ projectId, onClose }) {
    const [allUsers, setAllUsers] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        fetchData();
    }, [projectId]);

    async function fetchData() {
        try {
            setLoading(true);
            
            // Fetch all users
            const usersData = await apiFetch("/api/v1/users", { method: "GET" });
            setAllUsers(usersData.users || []);
            
            // Fetch project members
            const projectData = await projectAPI.getProjectById(projectId);
            const members = projectData.project.members || [];
            setTeamMembers(members);
            setSelectedMembers(members.map(m => m._id));
        } catch (err) {
            console.error('Error fetching data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function handleMemberToggle(userId) {
        setSelectedMembers(prev => 
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    }

    async function handleSaveMembers() {
        try {
            setLoading(true);
            setError("");

            // Find members to add and remove
            const membersToAdd = selectedMembers.filter(id => 
                !teamMembers.some(m => m._id === id)
            );
            const membersToRemove = teamMembers
                .map(m => m._id)
                .filter(id => !selectedMembers.includes(id));

            if (membersToAdd.length > 0) {
                await projectAPI.addMembers(projectId, membersToAdd);
            }

            if (membersToRemove.length > 0) {
                await projectAPI.removeMembers(projectId, membersToRemove);
            }

            setSuccess("Team members updated successfully!");
            setTimeout(() => {
                if (onClose) onClose();
            }, 1500);
        } catch (err) {
            setError(err.message || "Failed to update team members");
            console.error('Error updating team members:', err);
        } finally {
            setLoading(false);
        }
    }

    const availableUsers = allUsers.filter(user => 
        user.role !== 'admin' && user._id
    );

    return (
        <div className="input-div">
            <div className="input-content">
                <h2>Manage Team Members</h2>
                
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                {loading ? (
                    <div className="loading">Loading...</div>
                ) : (
                    <>
                        <div className="members-list">
                            {availableUsers.length === 0 ? (
                                <p>No users available</p>
                            ) : (
                                availableUsers.map(user => (
                                    <div key={user._id} className="member-item">
                                        <input
                                            type="checkbox"
                                            id={`member-${user._id}`}
                                            checked={selectedMembers.includes(user._id)}
                                            onChange={() => handleMemberToggle(user._id)}
                                        />
                                        <label htmlFor={`member-${user._id}`}>
                                            <span className="member-name">{user.username}</span>
                                            <span className="member-email">{user.email}</span>
                                            <span className={`member-role role-${user.role}`}>
                                                {user.role}
                                            </span>
                                        </label>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="form-actions">
                            <button 
                                onClick={handleSaveMembers} 
                                disabled={loading}
                                className="btn-primary"
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                            {onClose && (
                                <button onClick={onClose} className="btn-secondary">
                                    Cancel
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
