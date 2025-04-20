import React, { ReactNode } from 'react';
import styles from './card.module.css'; // Assuming you're using CSS Modules

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

const CardContent: React.FC<CardContentProps> = ({ children, className, ...props }) => {
  return (
    <div className={`${styles.cardContent} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default CardContent;
