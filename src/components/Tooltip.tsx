import React, { useState, useRef } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip: React.FC<TooltipProps> = ({ children, content, placement = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const childRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => setIsVisible(true);
  const hideTooltip = () => setIsVisible(false);

  const getTooltipPosition = () => {
    if (!childRef.current || !tooltipRef.current) return {};

    // Removed unused rect calculations
    switch (placement) {
      case 'top':
        return {
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '8px'
        };
      case 'bottom':
        return {
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: '8px'
        };
      case 'left':
        return {
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginRight: '8px'
        };
      case 'right':
        return {
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginLeft: '8px'
        };
      default:
        return {
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '8px'
        };
    }
  };

  return (
    <div 
      className="relative inline-block"
      ref={childRef}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          className="absolute z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md shadow-sm whitespace-nowrap"
          style={getTooltipPosition()}
        >
          {content}
          <div 
            className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
              placement === 'top' ? 'bottom-0 left-1/2 -translate-x-1/2 -mb-1' :
              placement === 'bottom' ? 'top-0 left-1/2 -translate-x-1/2 -mt-1' :
              placement === 'left' ? 'right-0 top-1/2 -translate-y-1/2 -mr-1' :
              'left-0 top-1/2 -translate-y-1/2 -ml-1'
            }`}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;