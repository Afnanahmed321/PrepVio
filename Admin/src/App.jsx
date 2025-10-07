import React from 'react';
import AdminPanel from './components/AdminPanel';
import Iridescence from '../Iridescence/Iridescence';

import './index.css';

function App() {
  return (
    <>
    <Iridescence
  color={[1, 1, 1]}
  mouseReact={false}
  amplitude={0.1}
  speed={1.0}
/>
    <div className="App bg-gray-100 min-h-screen">
      <AdminPanel />
    </div>
    </>
  );
}

export default App;