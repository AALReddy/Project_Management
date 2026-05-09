import React from 'react';
import { CgNotes } from "react-icons/cg";
import { BsChatDots } from "react-icons/bs";
import { NavLink } from 'react-router-dom';
import './sidebar.css';
import { clearSession, getCurrentUser } from '../utils/storage';

const Sidebar = () => {
    const user = getCurrentUser();

    const getNavItems = () => {
        const baseItems = [
            {
                title: "Home",
                icon: <CgNotes className="icon" />,
                link: '/home',
            },
            {
                title: "Tasks",
                icon: <CgNotes className="icon" />,
                link: '/tasks',
            },
            {
                title: "All Tasks",
                icon: <CgNotes className="icon" />,
                link: '/alltasks',
            },
            {
                title: "Incomplete",
                icon: <CgNotes className="icon" />,
                link: '/incompletetasks',
            },
            {
                title: "Completed",
                icon: <CgNotes className="icon" />,
                link: '/completedtasks',
            },
        ];

        // Role-based navigation
        if (user?.role === 'admin') {
            return [
                ...baseItems,
                {
                    title: "Admin Dashboard",
                    icon: <CgNotes className="icon" />,
                    link: '/admin-dashboard',
                },
            ];
        } else if (user?.role === 'manager') {
            return [
                ...baseItems,
                {
                    title: "My Projects",
                    icon: <CgNotes className="icon" />,
                    link: '/projects',
                },
            ];
        } else {
            // Member view
            return baseItems;
        }
    };

    const navItems = getNavItems();

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <div className="brand-mark">E</div>
                <h2>Ease2Work</h2>
                <h4>{user?.name || user?.username || 'User'}</h4>
                <span className="user-role">{user?.role || 'Member'}</span>
                <hr />
            </div>
            <div className="sidebar-nav">
                {navItems.map((item, index) => (
                    <NavLink 
                        to={item.link} 
                        key={index} 
                        className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                    >
                        <div className="icon">{item.icon}</div>
                        <div className="title">{item.title}</div>
                    </NavLink>
                ))}
            </div>
            <div className="sidebar-footer">    
                <NavLink to="/chat" className="sidebar-item sidebar-chat">
                    <div className="icon">
                        <BsChatDots />
                    </div>
                    <div className="title">Chat</div>
                </NavLink>
                <button onClick={() => {
                    clearSession();
                    window.location.href="/";
                }} className="logout-button">
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
