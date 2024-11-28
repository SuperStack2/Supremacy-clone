// src/App.tsx

import React from 'react';
import './App.css';
import GameMap from './components/GameMap/GameMap';
import Units from './components/Units/Units';
import Resources from './components/Resources/Resources';

function App() {
  return (
    <div className="container">
      <h1>Supremacy1914 Clone</h1>
      <Resources />
      <GameMap />
      <Units />
    </div>
  );
}

export default App;