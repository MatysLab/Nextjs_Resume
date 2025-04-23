'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, Minimize2, X, Eye, EyeOff } from 'lucide-react';

interface ResizableBlockProps {
  title: string;
  children: React.ReactNode;
  onRemove?: () => void;
  defaultWidth?: number;
  defaultHeight?: number;
  className?: string;
  showValueToggle?: boolean;
}

export function ResizableBlock({
  title,
  children,
  onRemove,
  defaultWidth = 100,
  defaultHeight = 100,
  className = '',
  showValueToggle = false
}: ResizableBlockProps) {
  const [width, setWidth] = useState(defaultWidth);
  const [height, setHeight] = useState(defaultHeight);
  const [isResizing, setIsResizing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hideValues, setHideValues] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef({ x: 0, y: 0, width: 0, height: 0 });

  // Maximum scaling factor (1.02 or 102% of original size)
  const MAX_SCALE = 1.02;

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    
    if (blockRef.current) {
      const rect = blockRef.current.getBoundingClientRect();
      startPosRef.current = {
        x: e.clientX,
        y: e.clientY,
        width: rect.width,
        height: rect.height
      };
    }
    
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizing) return;
    
    const dx = e.clientX - startPosRef.current.x;
    const dy = e.clientY - startPosRef.current.y;
    
    // Calculate new dimensions
    const newWidth = startPosRef.current.width + dx;
    const newHeight = startPosRef.current.height + dy;
    
    // Apply maximum scale constraint
    const widthScale = newWidth / defaultWidth;
    const heightScale = newHeight / defaultHeight;
    
    if (widthScale <= MAX_SCALE) {
      setWidth(Math.max(50, newWidth)); // Minimum width of 50px
    }
    
    if (heightScale <= MAX_SCALE) {
      setHeight(Math.max(50, newHeight)); // Minimum height of 50px
    }
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
  }, []);

  return (
    <motion.div
      ref={blockRef}
      className={`bg-gray-900 border border-gray-800 rounded-lg shadow-lg overflow-hidden ${className}`}
      style={{
        width: isExpanded ? '100%' : `${width}%`,
        height: isExpanded ? 'auto' : `${height}%`,
        position: 'relative',
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <div className="bg-gray-800 p-3 flex items-center justify-between border-b border-gray-700">
        <h3 className="text-white font-medium">{title}</h3>
        <div className="flex items-center space-x-1">
          {showValueToggle && (
            <button
              onClick={() => setHideValues(!hideValues)}
              className="text-gray-400 hover:text-white p-1 rounded focus:outline-none"
              title={hideValues ? "Show values" : "Hide values"}
            >
              {hideValues ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
          <button
            onClick={toggleExpand}
            className="text-gray-400 hover:text-white p-1 rounded focus:outline-none"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          {onRemove && (
            <button
              onClick={onRemove}
              className="text-gray-400 hover:text-red-500 p-1 rounded focus:outline-none"
              title="Remove"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
      
      <div className="p-4">
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, { hideValues });
          }
          return child;
        })}
      </div>
      
      {!isExpanded && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={handleResizeStart}
        >
          <div className="w-0 h-0 border-l-8 border-t-8 border-l-transparent border-t-transparent bg-transparent rotate-45 transform origin-bottom-right">
            <div className="w-4 h-4 bg-gray-600 rounded-bl"></div>
          </div>
        </div>
      )}
    </motion.div>
  );
} 