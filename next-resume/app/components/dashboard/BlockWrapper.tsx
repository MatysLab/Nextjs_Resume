'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { GripVertical, X, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';

// Grid configuration
const GRID_SIZE = 12.5; // 8 blocks = 100% (each block is 12.5% of space)

interface BlockWrapperProps {
  id: string;
  onRemove: (id: string) => void;
  className?: string;
  children: React.ReactNode;
  initialWidth?: number; // As percentage of parent
  initialHeight?: number; // In pixels
}

export default function BlockWrapper({ 
  id, 
  onRemove, 
  className = '', 
  children,
  initialWidth = 100, // Default is 100% width
  initialHeight = 300 // Default height
}: BlockWrapperProps) {
  // Size state
  const [width, setWidth] = useState(initialWidth);
  const [height, setHeight] = useState(initialHeight);
  const [previewWidth, setPreviewWidth] = useState(initialWidth);
  const [previewHeight, setPreviewHeight] = useState(initialHeight);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [snappedWidth, setSnappedWidth] = useState(initialWidth);
  
  // Refs for elements
  const blockRef = useRef<HTMLDivElement>(null);
  
  // Start drag functionality
  const startDrag = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDragging(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startPosition = { ...position };
    
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: startPosition.x + (e.clientX - startX),
        y: startPosition.y + (e.clientY - startY)
      });
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  // Resize handlers
  const startResize = (e: React.MouseEvent<HTMLDivElement>, direction: string) => {
    e.preventDefault();
    setIsResizing(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = width;
    const startHeight = height;
    const parentWidth = blockRef.current?.parentElement?.clientWidth || 1;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (direction.includes('right')) {
        // Calculate width as percentage of parent
        let newWidth = startWidth + ((e.clientX - startX) / parentWidth) * 100;
        newWidth = Math.max(GRID_SIZE, newWidth); // Minimum width is one grid unit
        newWidth = Math.min(100, newWidth); // Maximum width is 100%
        
        // Calculate the snapped width for visual feedback
        const snapWidth = Math.round(newWidth / GRID_SIZE) * GRID_SIZE;
        
        // Update the preview width
        setPreviewWidth(newWidth);
        setSnappedWidth(snapWidth);
      }
      
      if (direction.includes('bottom')) {
        let newHeight = startHeight + (e.clientY - startY);
        
        // Ensure minimum height
        newHeight = Math.max(100, newHeight);
        
        // Update the preview height
        setPreviewHeight(newHeight);
      }
    };
    
    const handleMouseUp = () => {
      // On mouse up, apply the snapped dimensions
      if (direction.includes('right')) {
        setWidth(snappedWidth);
      }
      if (direction.includes('bottom')) {
        setHeight(previewHeight);
      }
      
      // Reset preview dimensions to match actual dimensions
      setPreviewWidth(snappedWidth);
      setPreviewHeight(previewHeight);
      
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  // Apply cursor styles when resizing or dragging
  useEffect(() => {
    if (isResizing) {
      document.body.style.cursor = 'grabbing';
    } else if (isDragging) {
      document.body.style.cursor = 'grabbing';
    } else {
      document.body.style.cursor = 'default';
    }
    
    return () => {
      document.body.style.cursor = 'default';
    };
  }, [isResizing, isDragging]);

  return (
    <motion.div
      ref={blockRef}
      layout
      initial={{ opacity: 0, y: -20 }}
      animate={{ 
        opacity: 1, 
        y: position.y,
        x: position.x
      }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ 
        duration: 0.2,
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      className={`relative ${className}`}
      style={{ 
        width: `${width}%`,
        height: `${height}px`,
        transition: 'width 0.3s ease, height 0.3s ease',
        zIndex: isDragging || isResizing ? 10 : 1
      }}
    >
      {/* Resize Preview Overlay */}
      {isResizing && (
        <div 
          className="absolute bg-blue-500/20 border-2 border-blue-500/40 rounded-md pointer-events-none"
          style={{
            width: `${previewWidth / width * 100}%`,
            height: `${previewHeight / height * 100}%`,
            left: 0,
            top: 0,
            zIndex: 20
          }}
        />
      )}
      
      {/* Grid Snap Guide */}
      {isResizing && (
        <div 
          className="absolute top-0 bottom-0 border-r-2 border-blue-500 pointer-events-none z-30" 
          style={{ left: `${snappedWidth / width * 100}%` }}
        />
      )}
      
      {/* Controls */}
      <div className="absolute top-2 right-2 z-10 flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white hover:bg-white/10 cursor-grab active:cursor-grabbing"
          title="Drag to reorder"
          onMouseDown={startDrag}
        >
          <GripVertical className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-red-400 hover:text-white hover:bg-red-500/20"
          onClick={() => onRemove(id)}
          title="Remove Block"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Content */}
      <div className="w-full h-full">
        {children}
      </div>
      
      {/* Resize Handles */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-blue-500/30"
        onMouseDown={(e) => startResize(e, 'right')}
      />
      <div 
        className="absolute left-0 right-0 bottom-0 h-2 cursor-ns-resize hover:bg-blue-500/30"
        onMouseDown={(e) => startResize(e, 'bottom')}
      />
      <div 
        className="absolute right-0 bottom-0 w-4 h-4 cursor-nwse-resize hover:bg-blue-500/50"
        onMouseDown={(e) => startResize(e, 'right-bottom')}
      />
    </motion.div>
  );
} 