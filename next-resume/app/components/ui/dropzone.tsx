'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface DropzoneProps {
  onDrop: (acceptedFiles: File[]) => void;
  maxFiles?: number;
  maxSize?: number;
  accept?: Record<string, string[]>;
  className?: string;
  disabled?: boolean;
  title?: string;
  description?: string;
}

export function Dropzone({
  onDrop,
  maxFiles = 1,
  maxSize = 5242880, // 5MB by default
  accept = {
    'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
  },
  className,
  disabled = false,
  title = 'Upload image',
  description = 'Drag and drop image here, or click to select file'
}: DropzoneProps) {
  const [error, setError] = useState<string | null>(null);

  const onDropCallback = useCallback((acceptedFiles: File[]) => {
    setError(null);
    onDrop(acceptedFiles);
  }, [onDrop]);

  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    onDrop: onDropCallback,
    maxFiles,
    maxSize,
    accept,
    disabled,
    onDropRejected: (rejections) => {
      if (rejections.length > 0) {
        const { code } = rejections[0].errors[0];
        if (code === 'file-too-large') {
          setError(`File is too large. Max size is ${maxSize / 1024 / 1024}MB`);
        } else if (code === 'file-invalid-type') {
          setError('Invalid file type. Only images are accepted');
        } else if (code === 'too-many-files') {
          setError(`Too many files. Max ${maxFiles} file${maxFiles > 1 ? 's' : ''}`);
        } else {
          setError('Error uploading file');
        }
      }
    }
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded-lg p-6 transition-colors flex flex-col items-center justify-center cursor-pointer',
        isDragActive ? 'border-amber-500 bg-amber-500/10' : 'border-gray-700 hover:border-gray-600',
        isDragReject && 'border-red-500 bg-red-500/10',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <input {...getInputProps()} />
      
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