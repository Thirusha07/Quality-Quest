import React, { ReactNode } from 'react';
import styles from './tabs.module.css'; // Assuming you're using CSS Modules

interface TabsListProps {
  children: ReactNode;
  className?: string;
}

const TabsList: React.FC<TabsListProps> = ({ children, className }) => {
  return <div className={`${styles.tabsList} ${className}`}>{children}</div>;
};

export default TabsList;
