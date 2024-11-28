// src/components/GameMap/GameMap.tsx

import React, { useRef, useEffect } from 'react';
import * as PIXI from 'pixi.js';

const GameMap: React.FC = () => {
  const pixiContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // PixiJS-Anwendung erstellen
    const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x1099bb,
      resizeTo: window, // Automatische Größenanpassung
    });

    // PixiJS-Anwendung zum DOM hinzufügen
    if (pixiContainer.current) {
      pixiContainer.current.appendChild(app.view);
    }

    // Karte als Sprite hinzufügen
    const mapTexture = PIXI.Texture.from('/map-placeholder.jpg');
    const mapSprite = new PIXI.Sprite(mapTexture);

    // Größe anpassen
    mapSprite.width = app.screen.width;
    mapSprite.height = app.screen.height;

    // Füge das Karten-Sprite zur Bühne hinzu
    app.stage.addChild(mapSprite);

    // Interaktion aktivieren
    mapSprite.interactive = true;
    mapSprite.buttonMode = true;

    // Dragging-Variablen initialisieren
    let dragging = false;
    let dragData: PIXI.InteractionData | null = null;
    let dragOffset = { x: 0, y: 0 };

    // Event Handler
    const onDragStart = (event: PIXI.InteractionEvent) => {
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

    // Cleanup bei Komponentendemontage
    return () => {
      app.view.removeEventListener('wheel', handleWheel);
      app.destroy(true, true);
    };
  }, []);

  return <div ref={pixiContainer} style={{ width: '100%', height: '100%' }}></div>;
};

export default GameMap;