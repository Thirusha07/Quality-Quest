import React, { ReactNode } from 'react';
import styles from './card.module.css';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div className={`${styles.card} ${className ?? ''}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
