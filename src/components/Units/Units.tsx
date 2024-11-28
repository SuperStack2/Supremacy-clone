import React from 'react';
import styles from './Units.module.css';

const Units: React.FC = () => {
  const units = [
    { id: 1, type: 'Infanterie', position: { x: 10, y: 20 } },
    { id: 2, type: 'Panzer', position: { x: 30, y: 40 } },
  ];

  return (
    <div className={styles.unitsContainer}>
      <h2>Einheiten</h2>
      <ul className={styles.unitList}>
        {units.map((unit) => (
          <li key={unit.id} className={styles.unitItem}>
            {unit.type} bei Position ({unit.position.x}, {unit.position.y})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Units;