import React from 'react';
import styles from './tabs.module.css'; // Assuming you're using CSS Modules

interface TabsContentProps {
  value: string;
  activeTab: string;
  children: React.ReactNode;
  className?: string;
}

const TabsContent: React.FC<TabsContentProps> = ({ value, activeTab, children, className }) => {
  const isActive = activeTab === value;

  return isActive ? <div className={`${styles.tabsContent} ${className}`}>{children}</div> : null;
};

export default TabsContent;
