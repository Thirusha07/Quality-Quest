import React from 'react';
import styles from './tabs.module.css'; // Assuming you're using CSS Modules

interface TabsTriggerProps {
  value: string;
  activeTab: string;
  handleTabChange: (tab: string) => void;
  children: React.ReactNode;
  className?: string;
}

const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, activeTab, handleTabChange, children, className }) => {
  const isActive = activeTab === value;

  return (
    <button
      className={`${styles.tabsTrigger} ${isActive ? styles.active : ''} ${className}`}
      onClick={() => handleTabChange(value)}
    >
      {children}
    </button>
  );
};

export default TabsTrigger;
