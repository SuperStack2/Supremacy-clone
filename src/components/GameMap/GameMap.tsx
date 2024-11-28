// src/components/GameMap/GameMap.tsx

import React, { useRef, useEffect } from 'react';
import * as PIXI from 'pixi.js';

const GameMap: React.FC = () => {
  const tileSize = 32; // Size of each grid tile
  let selectedUnit: PIXI.Sprite | null = null;


  const pixiContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // PixiJS-Anwendung erstellen
    const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x1099bb,
    });

    // PixiJS-Anwendung zum DOM hinzufügen
    if (pixiContainer.current) {
      pixiContainer.current.appendChild(app.view);
    }

    // Karte als Sprite hinzufügen
    const mapTexture = PIXI.Texture.from('/map-placeholder.jpg'); // Assuming you have a map image at this path
    const mapSprite = new PIXI.Sprite(mapTexture);

    // Größe anpassen
    mapSprite.width = app.screen.width;
    mapSprite.height = app.screen.height;

    // Füge das Karten-Sprite zur Bühne hinzu
    app.stage.addChild(mapSprite);

    // Einheit (Infanterie) hinzufügen
    const infantryTexture = PIXI.Texture.from('/infantry.png');
    const infantryUnit = new PIXI.Sprite(infantryTexture);
    infantryUnit.x = tileSize;
    infantryUnit.y = tileSize;
    infantryUnit.width = tileSize;
    infantryUnit.height = tileSize;
    infantryUnit.interactive = true;
    infantryUnit.buttonMode = true; 
    
    infantryUnit.on('pointerdown', () => {
      selectedUnit = infantryUnit;
    });

    app.stage.addChild(infantryUnit);

    // Interaktion aktivieren
    mapSprite.interactive = true;
    //mapSprite.buttonMode = true; // Use this for older PixiJS versions
    mapSprite.cursor = 'grab'; // Use this for newer PixiJS versions for the hand cursor

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

    const onMapClick = (event: PIXI.interaction.InteractionEvent) => {
      if (selectedUnit) {
        const targetX = Math.floor(event.data.global.x / tileSize) * tileSize;
        const targetY = Math.floor(event.data.global.y / tileSize) * tileSize;
  
        // Hier würdest du normalerweise eine Pfadfindungslogik verwenden, 
        // um den besten Pfad zum Ziel zu finden.
        // Für diese einfache Implementierung bewegen wir die Einheit direkt zum Ziel.
        selectedUnit.x = targetX;
        selectedUnit.y = targetY;
  
        selectedUnit = null; // Einheit nach dem Bewegen abwählen
      }
    }

    mapSprite.on('pointerdown', onMapClick);

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

    // Cleanup bei Komponentendemontage
    return () => {
      app.destroy(true, true);
    };
  }, []);

  return <div ref={pixiContainer} style={{ width: '100%', height: '100%' }}></div>;
};

export default GameMap;