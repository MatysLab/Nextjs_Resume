'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { NativeDropzone } from '@/app/components/ui/native-dropzone';
import { cn } from '@/app/lib/utils';
import { Wand2, Image as ImageIcon, Layers, RotateCcw } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface ImageEnhancerProps {
  originalImage: File | null;
  onEnhancedImage: (file: File) => void;
  className?: string;
}

export function ImageEnhancer({ originalImage, onEnhancedImage, className }: ImageEnhancerProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [enhancedPreview, setEnhancedPreview] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancementLevel, setEnhancementLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [backgroundStyle, setBackgroundStyle] = useState<'none' | 'gradient' | 'solid' | 'shadow'>('none');

  // Load image preview when image changes
  useEffect(() => {
    if (originalImage) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
        // Initially set enhanced preview to the original
        setEnhancedPreview(reader.result as string);
      };
      reader.readAsDataURL(originalImage);
    } else {
      setImagePreview(null);
      setEnhancedPreview(null);
    }
  }, [originalImage]);

  // Simulate image enhancement
  const enhanceImage = () => {
    if (!imagePreview) return;
    
    setIsEnhancing(true);
    
    // Simulating enhancement processing time
    setTimeout(() => {
      // In a real implementation, this would call an actual image enhancement API
      // For now, we'll just use the original image with CSS effects applied via the UI
      setEnhancedPreview(imagePreview);
      setIsEnhancing(false);
      
      // Convert enhanced preview to File to pass back to parent
      if (originalImage) {
        onEnhancedImage(originalImage);
      }
    }, 1500);
  };

  // Background style classes for the image
  const getBackgroundStyleClass = () => {
    switch (backgroundStyle) {
      case 'gradient':
        return 'bg-gradient-to-b from-gray-800 to-black';
      case 'solid':
        return 'bg-gray-900';
      case 'shadow':
        return 'shadow-2xl shadow-amber-500/20';
      default:
        return '';
    }
  };

  // Enhancement classes for the image
  const getEnhancementClass = () => {
    switch (enhancementLevel) {
      case 'low':
        return 'brightness-105 contrast-105';
      case 'medium':
        return 'brightness-110 contrast-110 saturate-105';
      case 'high':
        return 'brightness-115 contrast-120 saturate-110 shadow-lg';
      default:
        return '';
    }
  };

  // Custom tabs implementation
  const TabsRoot = ({children, value, onValueChange, className}: {
    children: React.ReactNode;
    value: string;
    onValueChange: (value: string) => void;
    className?: string;
  }) => {
    return (
      <div className={cn("w-full", className)}>
        {children}
      </div>
    );
  };

  const TabsListComponent = ({children, className}: {
    children: React.ReactNode;
    className?: string;
  }) => {
    return (
      <div className={cn("inline-flex h-10 items-center justify-center rounded-lg bg-gray-800 p-1 text-gray-400 w-full", className)}>
        {children}
      </div>
    );
  };

  const TabsTriggerComponent = ({children, value, currentValue, onSelect, className}: {
    children: React.ReactNode;
    value: string;
    currentValue: string;
    onSelect: () => void;
    className?: string;
  }) => {
    const isActive = value === currentValue;
    return (
      <button
        type="button"
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 flex-1",
          isActive ? "bg-amber-500 text-gray-950" : "hover:bg-gray-700",
          className
        )}
        onClick={onSelect}
      >
        {children}
      </button>
    );
  };

  return (
    <div className={cn("bg-gray-950 border border-gray-800 rounded-lg p-4", className)}>
      <h3 className="text-lg font-medium text-white mb-3 flex items-center">
        <Wand2 className="w-5 h-5 text-amber-500 mr-2" />
        Image Enhancer
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original image preview */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <div className="p-2 bg-gray-800 border-b border-gray-700 text-gray-400 text-sm">
            Original Image
          </div>
          <div className="h-64 flex items-center justify-center p-4">
            {imagePreview ? (
              <img 
                src={imagePreview} 
                alt="Original" 
                className="max-h-full max-w-full object-contain" 
              />
            ) : (
              <div className="text-gray-500 text-center">
                <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No image selected</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Enhanced image preview */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <div className="p-2 bg-gray-800 border-b border-gray-700 text-gray-400 text-sm">
            Enhanced Preview
          </div>
          <div className={cn("h-64 flex items-center justify-center p-4", getBackgroundStyleClass())}>
            {isEnhancing ? (
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mb-2 mx-auto"></div>
                <p className="text-gray-400">Enhancing image...</p>
              </div>
            ) : enhancedPreview ? (
              <motion.img 
                src={enhancedPreview} 
                alt="Enhanced" 
                className={cn("max-h-full max-w-full object-contain", getEnhancementClass())}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            ) : (
              <div className="text-gray-500 text-center">
                <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Enhanced image will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Enhancement controls */}
      <div className="mt-6 space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-2">Enhancement Level</h4>
          <TabsRoot 
            value={enhancementLevel}
            onValueChange={(val) => setEnhancementLevel(val as 'low' | 'medium' | 'high')}
            className="w-full"
          >
            <TabsListComponent className="w-full bg-gray-800">
              <TabsTriggerComponent value="low" currentValue={enhancementLevel} onSelect={() => setEnhancementLevel('low')} className="flex-1">Low</TabsTriggerComponent>
              <TabsTriggerComponent value="medium" currentValue={enhancementLevel} onSelect={() => setEnhancementLevel('medium')} className="flex-1">Medium</TabsTriggerComponent>
              <TabsTriggerComponent value="high" currentValue={enhancementLevel} onSelect={() => setEnhancementLevel('high')} className="flex-1">High</TabsTriggerComponent>
            </TabsListComponent>
          </TabsRoot>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-2">Background Style</h4>
          <TabsRoot 
            value={backgroundStyle}
            onValueChange={(val) => setBackgroundStyle(val as 'none' | 'gradient' | 'solid' | 'shadow')}
            className="w-full"
          >
            <TabsListComponent className="w-full bg-gray-800">
              <TabsTriggerComponent value="none" currentValue={backgroundStyle} onSelect={() => setBackgroundStyle('none')} className="flex-1">None</TabsTriggerComponent>
              <TabsTriggerComponent value="gradient" currentValue={backgroundStyle} onSelect={() => setBackgroundStyle('gradient')} className="flex-1">Gradient</TabsTriggerComponent>
              <TabsTriggerComponent value="solid" currentValue={backgroundStyle} onSelect={() => setBackgroundStyle('solid')} className="flex-1">Solid</TabsTriggerComponent>
              <TabsTriggerComponent value="shadow" currentValue={backgroundStyle} onSelect={() => setBackgroundStyle('shadow')} className="flex-1">Shadow</TabsTriggerComponent>
            </TabsListComponent>
          </TabsRoot>
        </div>
      </div>
      
      {/* Actions */}
      <div className="mt-6 flex justify-end gap-2">
        <Button 
          variant="outline" 
          className="flex items-center gap-1"
          onClick={() => {
            setEnhancedPreview(imagePreview);
            setBackgroundStyle('none');
            setEnhancementLevel('medium');
          }}
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
        <Button 
          onClick={enhanceImage}
          disabled={!imagePreview || isEnhancing}
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          <Wand2 className="h-4 w-4 mr-1" />
          {isEnhancing ? 'Enhancing...' : 'Enhance Image'}
        </Button>
      </div>
    </div>
  );
} 