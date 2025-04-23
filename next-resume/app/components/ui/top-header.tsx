'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from './button';
import { Share2, FilePlus2, Eye, Bell } from 'lucide-react';

export function TopHeader() {
  return (
    <div className="fixed top-0 right-0 left-64 h-14 bg-black/80 backdrop-blur-sm border-b border-gray-800 z-10 px-6 flex items-center justify-between">
      <div className="flex-1"></div> {/* Spacer */}
      
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
          <Share2 className="h-5 w-5" />
        </Button>
        
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
          <FilePlus2 className="h-5 w-5" />
        </Button>
        
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
          <Eye className="h-5 w-5" />
        </Button>
        
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
          <Bell className="h-5 w-5" />
        </Button>
        
        <Button variant="outline" className="rounded-full">
          Add assets
        </Button>
      </div>
    </div>
  );
} 