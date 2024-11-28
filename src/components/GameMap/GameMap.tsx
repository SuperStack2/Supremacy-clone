import React, { useRef, useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
import { Unit, Territory } from '../../types/types';

// Define the GameMapProps interface
interface GameMapProps {
  territories: Territory[];
  units: Unit[];
  onUnitMove: (unitId: number, territoryId: number) => void;
  onMapClick: (x: number, y: number) => void;
}

const GameMap: React.FC<GameMapProps> = ({ territories, units, onUnitMove, onMapClick }) => {
  const tileSize = 32; // Size of each grid tile
  const pixiContainer = useRef<HTMLDivElement>(null); // Correctly typed ref

  const [isContainerReady, setIsContainerReady] = useState(false);

  useEffect(() => {
    if (pixiContainer.current) {
      setIsContainerReady(true);
    }
  }, [pixiContainer.current]); // Access current value of ref

  useEffect(() => {
    if (isContainerReady) {
      // PixiJS application setup
      const app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      // Append PixiJS view to the container
      pixiContainer.current?.appendChild(app.view); 

      // ... (rest of your PixiJS initialization and cleanup code)
    }
  }, [isContainerReady]);

  return (
    <div ref={pixiContainer} style={{ width: '100%', height: '100%' }} />
  );
};

export default GameMap;
