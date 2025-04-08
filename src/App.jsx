import { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import PropTypes from 'prop-types';

function App({ children }) {
  const [expanded, setExpanded] = useState(true); // State to control sidebar expansion

  return (
    <div className="flex">
      <Sidebar expanded={expanded} setExpanded={setExpanded} />

      <main className="w-full">
        {children}
      </main>
    </div>
  );
}

App.propTypes = {
  children: PropTypes.node, // Validate that `children` is a React node
};

export default App;
