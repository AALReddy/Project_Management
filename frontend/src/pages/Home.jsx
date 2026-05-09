// pages/Home.js
import React from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';
import './styles.css';
import Cards from '../components/Cards';  // Import Cards

const Home = () => {
  const [inputDiv, setInputDiv] = React.useState(false);

  return (
    <div className="app-shell">
      <div className="sidebar-frame">
        <Sidebar />
      </div>

      <main className="content-panel">
        <Cards InputDiv={inputDiv} setInputDiv={setInputDiv} />
        <Outlet />
      </main>
    </div>
  );
}

export default Home;
