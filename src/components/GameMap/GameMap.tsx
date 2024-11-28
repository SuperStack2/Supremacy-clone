// src/components/GameMap/GameMap.tsx

import React, { useRef, useEffect } from 'react';
import * as PIXI from 'pixi.js';
import { Unit, Territory } from '../../types/types';

interface GameMapProps {
  territories: Territory[];
  units: Unit[];
  onUnitMove: (unitId: number, territoryId: number) => void;
  onMapClick: (x: number, y: number) => void;
}

const GameMap: React.FC<GameMapProps> = ({ territories, units, onUnitMove, onMapClick }) => {
  const tileSize = 32; // Size of each grid tile
  const pixiContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // PixiJS-Anwendung erstellen
    const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // PixiJS-Anwendung zum DOM hinzufügen
    const appendPixiView = () => {
      if (pixiContainer.current) {
        pixiContainer.current.appendChild(app.view);
      } else {
        // Retry in a short interval using requestAnimationFrame
        requestAnimationFrame(appendPixiView);
      }
    };

    appendPixiView();

    // Create the map sprite
    const mapSprite = PIXI.Sprite.from('/assets/map.png');
    mapSprite.width = app.screen.width;
    mapSprite.height = app.screen.height;

    app.stage.addChild(mapSprite);

    // Make the background interactive for dragging and clicking
    mapSprite.interactive = true;

    // Cleanup: Destroy the PixiJS application when the component unmounts
    return () => {
      app.destroy(true, true);
    };
  }, []);

  return (
    <div ref={pixiContainer} style={{ width: '100%', height: '100%' }} />
  );
};

export default GameMap;
