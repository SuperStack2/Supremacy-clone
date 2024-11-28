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
    if (pixiContainer.current) {
      pixiContainer.current.appendChild(app.view);
    }
    
    // Create the map sprite
    const mapSprite = PIXI.Sprite.from('/map.png'); 
    mapSprite.width = app.screen.width;
    mapSprite.height = app.screen.height;
    
    app.stage.addChild(mapSprite);

    // Make the background interactive for dragging and clicking
    mapSprite.interactive = true;

    const unitSprites: { [id: number]: PIXI.Sprite } = {};
    const territorySprites: { [id: number]: PIXI.Graphics } = {};

    const renderUnits = () => {
      // Remove existing unit sprites
      for (const id in unitSprites) {
        app.stage.removeChild(unitSprites[id]);
        delete unitSprites[id];
      }

      // Render new unit sprites
      units.forEach(unit => {
        const texture = PIXI.Texture.from(unit.type === 'Infantry' ? '/infantry.png' : '/other_unit.png'); 
        const sprite = new PIXI.Sprite(texture);
        sprite.x = unit.x;
        sprite.y = unit.y;
        sprite.width = 20; // Adjust size as needed
        sprite.height = 20; // Adjust size as needed
        app.stage.addChild(sprite);
        unitSprites[unit.id] = sprite; 
      });
    };

    const renderTerritories = () => {
      territories.forEach(territory => {
        const graphics = new PIXI.Graphics();
        graphics.beginFill(territory.ownerId === 1 ? 0x00FF00 : 0xFF0000, 0.5); // Green for player 1, red for player 2
        graphics.drawRect(territory.x, territory.y, territory.width, territory.height);
        graphics.endFill();
        graphics.interactive = true;
        graphics.on('pointerdown', () => handleTerritoryClick(territory));
        app.stage.addChild(graphics);
        territorySprites[territory.id] = graphics;
      });
    };

    const handleTerritoryClick = (territory: Territory) => {
      const selectedUnitId = units.find(unit => unit.selected)?.id;
      if (selectedUnitId) {
        onUnitMove(selectedUnitId, territory.id); 
      } else {
          initiateCombat(territory);
      }
    };



    // Interaktion aktivieren
    mapSprite.on('pointerdown', (event: PIXI.interaction.InteractionEvent) => {
      const position = event.data.getLocalPosition(app.stage);
      onMapClick(position.x, position.y);
    });
    
    mapSprite.cursor = 'grab'; 

    // Dragging-Variablen initialisieren
    let dragging = false;
    let dragData: PIXI.interaction.InteractionData | null = null;
    let dragOffset = { x: 0, y: 0 };

    // Event Handler
    const onDragStart = (event: PIXI.interaction.InteractionEvent) => {
      dragging = true;
      dragData = event.data; 
      const position = dragData.getLocalPosition(mapSprite.parent);
      dragOffset.x = mapSprite.x - position.x;
      dragOffset.y = mapSprite.y - position.y;
    };

    
    const onDragEnd = () => {
      dragging = false;
      dragData = null;
    };

    const onDragMove = () => {
      if (dragging && dragData) {
        const newPosition = dragData.getLocalPosition(mapSprite.parent);
        mapSprite.x = newPosition.x + dragOffset.x;
        mapSprite.y = newPosition.y + dragOffset.y;
      }
    };

    // Event Listener hinzufügen
    mapSprite
      .on('pointerdown', onDragStart)
      .on('pointerup', onDragEnd)
      .on('pointerupoutside', onDragEnd)
      .on('pointermove', onDragMove);

    // Zoom mit dem Mausrad
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const scaleAmount = e.deltaY > 0 ? 0.9 : 1.1;
      app.stage.scale.x *= scaleAmount;
      app.stage.scale.y *= scaleAmount;
    };

    app.view.addEventListener('wheel', handleWheel);

    renderUnits();
    renderTerritories();

    const initiateCombat = (territory: Territory) => {
      const attackingUnit = units.find(unit => unit.selected);
      const defendingUnit = units.find(unit => unit.territoryId === territory.id && unit.ownerId !== attackingUnit?.ownerId);
    
      if (attackingUnit && defendingUnit) {
        const attackerStrength = attackingUnit.count;
        const defenderStrength = defendingUnit.count;
    
        if (attackerStrength > defenderStrength) {
          // Attacker wins
          territory.ownerId = attackingUnit.ownerId;
          defendingUnit.count = 0; // Or reduce by a percentage
          attackingUnit.count = Math.round(attackingUnit.count * 0.9); // Reduce attacker's units by 10%
          onUnitMove(attackingUnit.id, territory.id); // Move attacker to the conquered territory
        } else {
          // Defender wins
          attackingUnit.count = Math.round(attackingUnit.count * 0.9);  // Reduce attacker's units by 10%
          defendingUnit.count = Math.round(defendingUnit.count * 0.9); // Reduce defender's units by 10%
        }
    
        renderUnits();
        renderTerritories(); 
      }
    };


    // Cleanup bei Komponentendemontage
    return () => {
      app.destroy(true, true);
    };
  }, [territories, units, onUnitMove, onMapClick]); 



  return <div ref={pixiContainer} style={{ width: '100%', height: '100%' }}></div>;
};

export default GameMap;