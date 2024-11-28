// src/App.tsx

import React from 'react';
import './App.css';
import GameMap from './components/GameMap/GameMap';
import Units from './components/Units/Units';
import Resources from './components/Resources/Resources';
import { Unit, Territory } from './types/types';
import territoriesData from './mapData';

function App() {
  const onMapClick = (x: number, y: number) => {
    // Log the coordinates to the console
    console.log(`Map clicked at: x=${x}, y=${y}`);
  };

  const units: Unit[] = []; // Initialize with your game units

  const territories: Territory[] = territoriesData;

  // Make sure to initialize territories with appropriate data 
  // including id, name, owner, x, and y coordinates

  const onUnitMove = (unitId: number, territoryId: number) => {
    // Log the unitId and territoryId to the console
    console.log(`Unit ${unitId} moved to territory ${territoryId}`);
  };

  return (
    <div className="container">
      <h1>Supremacy1914 Clone</h1>
      <Resources />
      <GameMap onMapClick={onMapClick} units={units} 
               territories={territories} onUnitMove={onUnitMove} />
      <Units />
    </div>
  );
}

export default App;