import React, { ReactNode } from 'react';
import styles from './card.module.css'; // Assuming you're using CSS Modules

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

const CardHeader: React.FC<CardHeaderProps> = ({ children, className, ...props }) => {
  return (
    <div className={`${styles.cardHeader} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default CardHeader;
