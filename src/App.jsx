import { Outlet } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar';

const App = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="w-full">
        <Outlet /> {/* This is where the child routes will be rendered */}
      </main>
    </div>
  );
};

export default App;
