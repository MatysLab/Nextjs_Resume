'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, File } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface NativeDropzoneProps {
  onDrop: (acceptedFiles: File[]) => void;
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
  className?: string;
  disabled?: boolean;
  title?: string;
  description?: string;
}

export function NativeDropzone({
  onDrop,
  maxFiles = 1,
  maxSize = 5242880, // 5MB by default
  accept = 'image/jpeg,image/png,image/gif,image/webp',
  className,
  disabled = false,
  title = 'Upload image',
  description = 'Drag and drop image here, or click to select file'
}: NativeDropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isDragReject, setIsDragReject] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled) return;
    
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragActive(false);
  };

  const validateFiles = (files: FileList | File[]): File[] => {
    const validFiles: File[] = [];
    const fileList = Array.from(files);
    
    setError(null);
    
    // Check number of files
    if (fileList.length > maxFiles) {
      setError(`Too many files. Max ${maxFiles} file${maxFiles > 1 ? 's' : ''}`);
      setIsDragReject(true);
      return validFiles;
    }
    
    // Validate each file
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      
      // Check file size
      if (file.size > maxSize) {
        setError(`File is too large. Max size is ${maxSize / 1024 / 1024}MB`);
        setIsDragReject(true);
        return validFiles;
      }
      
      // Check file type
      const acceptedTypes = accept.split(',');
      if (acceptedTypes.length > 0 && !acceptedTypes.includes(file.type)) {
        setError('Invalid file type. Only specified formats are accepted');
        setIsDragReject(true);
        return validFiles;
      }
      
      validFiles.push(file);
    }
    
    return validFiles;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled) return;
    
    setIsDragActive(false);
    setIsDragReject(false);
    
    const files = e.dataTransfer.files;
    const validFiles = validateFiles(files);
    
    if (validFiles.length > 0) {
      onDrop(validFiles);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || disabled) return;
    
    const validFiles = validateFiles(e.target.files);
    
    if (validFiles.length > 0) {
      onDrop(validFiles);
    }
    
    // Reset the input value to allow selecting the same file again
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  return (
    <div
      className={cn(
        'border-2 border-dashed rounded-lg p-6 transition-colors flex flex-col items-center justify-center cursor-pointer',
        isDragActive ? 'border-amber-500 bg-amber-500/10' : 'border-gray-700 hover:border-gray-600',
        isDragReject && 'border-red-500 bg-red-500/10',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        multiple={maxFiles > 1}
        className="hidden"
        disabled={disabled}
      />
      
      <div className="flex flex-col items-center justify-center text-center">
        <UploadCloud 
          className={cn(
            'h-10 w-10 mb-4',
            isDragActive ? 'text-amber-500' : 'text-gray-500',
            isDragReject && 'text-red-500'
          )} 
        />
        
        <h3 className="text-lg font-medium text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-400 mb-2">{description}</p>
        
        {error && (
          <div className="mt-2 text-sm text-red-500">
            {error}
          </div>
        )}
      </div>
    </div>
  );
} 