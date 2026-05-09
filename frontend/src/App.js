import './App.css';
import './pages/styles.css';
import Login from './components/Login';
import Signin from './components/Signin';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import Alltasks from './pages/Alltasks';
import ImportantTasks from './pages/Importanttasks';
import CompletedTasks from './pages/Completedtasks';
import IncompletedTasks from './pages/Incompletedtasks';
import AddProject from './components/AddProject';
import Dash from './pages/Dash';
import Projectdetails from './pages/Projectdetails';
import Projects from './pages/Projects';
import AdminDashboard from './pages/AdminDashboard';
import ProjectDashboard from './pages/ProjectDashboard';
import TasksPage from './pages/TasksPage';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signin />} />
          <Route path='/dashboard' element={<Dash />} />
          <Route path='/home' element={<Dash />} />

          <Route path='/alltasks' element={<Alltasks />} />
          <Route path='/importanttasks' element={<ImportantTasks />} />
          <Route path='/completedtasks' element={<CompletedTasks />} />
          <Route path='/incompletedtasks' element={<IncompletedTasks />} />

          <Route path='/admin' element={<AddProject />} />
          <Route path='/admin-dashboard' element={<AdminDashboard />} />
          <Route path='/projects' element={<Projects />} />
          <Route path='/project-dashboard/:projectId' element={<ProjectDashboard />} />
          <Route path='/tasks' element={<TasksPage />} />
          <Route path='/incompletetasks' element={<IncompletedTasks />} />
          <Route path='/projectdetails' element={<Projectdetails />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
