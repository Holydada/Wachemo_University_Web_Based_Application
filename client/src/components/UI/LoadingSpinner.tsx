import React from 'react';
import { Spinner } from 'react-bootstrap';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message,
  className = '',
  variant = 'primary'
}) => {
  const getSpinnerSize = () => {
    switch (size) {
      case 'sm': return { width: '1.5rem', height: '1.5rem' };
      case 'lg': return { width: '3rem', height: '3rem' };
      default: return { width: '2rem', height: '2rem' };
    }
  };

  const containerClasses = size === 'sm' 
    ? 'd-inline-flex align-items-center' 
    : 'd-flex flex-column align-items-center justify-content-center';

  return (
    <div className={`${containerClasses} ${className}`}>
      <Spinner 
        animation="border" 
        variant={variant}
        style={{
          ...getSpinnerSize(),
          borderTopColor: '#7a0a2d'
        }}
      />
      {message && (
        <div className={`mt-2 text-muted ${size === 'sm' ? 'ms-2' : 'text-center'}`}>
          {size === 'sm' ? (
            <small>{message}</small>
          ) : (
            <p className="mb-0">{message}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;