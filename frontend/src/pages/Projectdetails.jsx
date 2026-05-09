import React from 'react'
import Sidebar from '../components/Sidebar';
import { getCurrentProject } from '../utils/storage';

export default function Projectdetails() {

    let project = getCurrentProject();
  return (
    <div className="app-shell">
        <div className="sidebar-frame">
            <Sidebar />
        </div>
        <main className="content-panel">

        <div className="section-heading">
            <span>Current Assignment</span>
            <h1>Project Details</h1>
        </div>
        {project ? (
            <div className="project-detail-card">
                <div>
                    <span>Project Name</span>
                    <strong>{project.projectName}</strong>
                </div>
                <div>
                    <span>Project Description</span>
                    <p>{project.description}</p>
                </div>
            </div>
        ) : (
            <div className="empty-state">No project assigned yet.</div>
        )}
    </main>
    </div>
  )
}
