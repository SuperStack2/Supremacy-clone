import React from 'react';
import styles from './Resources.module.css';

const Resources: React.FC = () => {
  const [resources, setResources] = React.useState({
    money: 1000,
    supplies: 1000,
    manpower: 1000,
  });

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setResources((prevResources) => ({
        money: prevResources.money + 10,
        supplies: prevResources.supplies + 10,
        manpower: prevResources.manpower + 10,
      }));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={styles.resourcesContainer}>
      <h2>Resources</h2>
      <div className={styles.resourceItem}>
        Money: {resources.money} (+10/s)
      </div>
      <div className={styles.resourceItem}>
        Supplies: {resources.supplies} (+10/s)
      </div>
      <div className={styles.resourceItem}>
        Manpower: {resources.manpower} (+10/s)
      </div>
    </div>
  );
};

export default Resources;