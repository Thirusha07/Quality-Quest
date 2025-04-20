import React, { ReactNode } from 'react';
import styles from './card.module.css'; // Assuming you're using CSS Modules

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

const CardTitle: React.FC<CardTitleProps> = ({ children, className, ...props }) => {
  return (
    <h2 className={`${styles.cardTitle} ${className}`} {...props}>
      {children}
    </h2>
  );
};

export default CardTitle;
