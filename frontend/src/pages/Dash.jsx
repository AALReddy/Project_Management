import React, { useEffect, useState } from 'react'
import Cards from '../components/Cards'
import Sidebar from '../components/Sidebar'
import { apiFetch, projectAPI } from '../utils/api'
import { setStoredJSON } from '../utils/storage'

export default function Dash() {
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [ready, setReady] = useState(false);
    const [error, setError] = useState("");
    let token=localStorage.getItem("token")
    useEffect(()=>{
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    async function fetchData(){
      try {
        if (!token) {
          window.location.href = "/login";
          return;
        }

        let data= await apiFetch("/api/v1/get", { method:"GET" })
        if (!data?.users) {
          console.error('No user data received');
          setError("Could not load your profile.");
          return;
        }
        const user = data.users;
        setStoredJSON("user", user)
        localStorage.setItem("role", user.role || "")
        await fetchData1()
        setReady(true)
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Only set error if it's truly critical
        if (error.message.includes("401") || error.message.includes("403")) {
          setError("Unauthorized. Please log in again.");
          window.location.href = "/login";
        } else {
          // Allow dashboard to load with default values even if there's a non-critical error
          setReady(true);
        }
      }
        
    async function fetchData1(){
      try {
        const projectResponse = await projectAPI.getProjects();
        const projects = Array.isArray(projectResponse?.projects) ? projectResponse.projects : [];
        setStoredJSON("project", projects);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setStoredJSON("project", [])
      }
    }
       
    }
  return (
    <div className="app-shell">
    <div className="sidebar-frame">
        <Sidebar />
    </div>

    <main className="content-panel">
       {error && <div className="empty-state is-danger">{error}</div>}
       {!error && !ready && <div className="empty-state">Loading dashboard...</div>}
       {!error && ready && <Cards InputDiv={isTaskModalOpen} setInputDiv={setIsTaskModalOpen}/>}
    </main>
</div>
  )
}
