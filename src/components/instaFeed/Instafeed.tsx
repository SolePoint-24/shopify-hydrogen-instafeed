import React from 'react';
import { useInstafeed } from './hooks/useInstafeed';

export interface InstafeedProps {
  /** The full URL of the Instafeed script */
  scriptSrc: string;
  /** The nonce string for CSP compliance */
  nonce?: string;
  /** CSS classes for the feed container */
  className?: string;
  /** ID for the feed container div (default: 'insta-feed') */
  containerId?: string;
  /** Optional style object */
  style?: React.CSSProperties;
}

export const Instafeed: React.FC<InstafeedProps> = ({
  scriptSrc,
  nonce,
  className,
  containerId = 'insta-feed',
  style
}) => {
  
  // Invoke logic hook
  useInstafeed({
    scriptSrc,
    nonce,
    containerId
  });

  return (
    <div 
      id={containerId} 
      className={className} 
      style={style}
    />
  );
};