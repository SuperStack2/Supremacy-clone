import React from 'react';
import styles from './Resources.module.css';

const Resources: React.FC = () => {
  const resources = {
    gold: 1000,
    food: 500,
    oil: 300,
  };

  return (
    <div className={styles.resourcesContainer}>
      <h2>Ressourcen</h2>
      <ul className={styles.resourcesList}>
        <li className={styles.resourceItem}>Gold: {resources.gold}</li>
        <li className={styles.resourceItem}>Nahrung: {resources.food}</li>
        <li className={styles.resourceItem}>Öl: {resources.oil}</li>
      </ul>
    </div>
  );
};

export default Resources;