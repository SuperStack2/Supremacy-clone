import React, { useState } from 'react';
import infantry from '../../assets/infantry.png'; // Placeholder image

interface Unit {
  id: number;
  type: string;
  count: number;
  position: { x: number; y: number };
}

class UnitLogic {
  position: { x: number; y: number };

  constructor(x: number, y: number) {
    this.position = { x, y };
  }

  moveTo(x: number, y: number) { this.position = { x, y }; }
}

const UnitComponent: React.FC<Unit> = ({ id, type, position }) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleClick = () => {
    setIsSelected(!isSelected);
  };

  const style = {
    left: position.x,
    top: position.y,
    border: isSelected ? '2px solid red' : 'none',
  };

  return (
    <img
      src={infantry}
      alt={type}
      className="unit"
      style={style}
      onClick={handleClick}
    />
  );
};

const Units: React.FC = () => {
  const [units, setUnits] = useState<Unit[]>([
    { id: 1, type: 'Infantry', count: 10, position:  new UnitLogic(100, 100).position },
    { id: 2, type: 'Infantry', count: 15, position: new UnitLogic(200, 200).position }
  ]);
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (selectedUnitId) {
        const selectedUnitIndex = units.findIndex((unit) => unit.id === selectedUnitId);
        
        if (selectedUnitIndex !== -1) {
            const updatedUnits = [...units];
            const unitLogic = new UnitLogic(units[selectedUnitIndex].position.x, units[selectedUnitIndex].position.y)
            unitLogic.moveTo(event.clientX - 16, event.clientY - 16)
            updatedUnits[selectedUnitIndex].position = unitLogic.position
            setUnits(updatedUnits);
            setSelectedUnitId(null); 
        }
    }
  };

  const handleBattleOutcome = (unitId: number, losses: number) => {
    setUnits((prevUnits) => {
      const updatedUnits = prevUnits.map((unit) => {
        if (unit.id === unitId) {
          return { ...unit, count: Math.max(0, unit.count - losses) }; 
        }
        return unit;
      });
      return updatedUnits;
    });
  };

  return (
    <div className="units-container" onClick={handleMapClick}>
      {units.map((unit) => (
        <UnitComponent key={unit.id} {...unit}/>
      ))}
    </div>
  );
};

export default Units;