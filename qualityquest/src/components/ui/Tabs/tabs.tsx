"use client"
import React, { ReactElement, ReactNode, useState } from 'react';
import styles from './tabs.module.css'; // Assuming you're using CSS Modules

interface TabsProps {
  children: ReactNode;
  defaultValue?: string;
  className?: string;
}

interface TabChildProps {
  activeTab: string;
  handleTabChange: (tab: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ children, defaultValue = '', className }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className={`${styles.tabs} ${className || ''}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as ReactElement<TabChildProps>, {
            activeTab,
            handleTabChange,
          });
        }
        return child;
      })}
    </div>
  );
};

export default Tabs;
