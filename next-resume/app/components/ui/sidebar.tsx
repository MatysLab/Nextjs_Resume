'use client';

import Link from 'next/link';
import React from 'react';
import { Store, ChartBar, LayoutDashboard, Settings, Info, HelpCircle, Crown } from 'lucide-react';
import { Button } from './button';

interface SidebarProps {
  currentPage?: 'dashboard' | 'services' | 'about' | 'support' | 'projects' | 'pricing' | 'boutique' | 'portfolio';
}

export function Sidebar({ currentPage = 'dashboard' }: SidebarProps) {
  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-black/70 border-r border-gray-800 flex flex-col backdrop-blur-sm z-10">
      {/* Gradient overlays */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-amber-500/30 to-transparent opacity-70"></div>
        <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-transparent opacity-100"></div>
      </div>
      
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center px-6 py-6 relative z-10">
        <div className="w-10 h-10 bg-amber-500 flex items-center justify-center rounded-sm mr-3">
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-black">
            <path d="M3 7C3 6.44772 3.44772 6 4 6H20C20.5523 6 21 6.44772 21 7C21 7.55228 20.5523 8 20 8H4C3.44772 8 3 7.55228 3 7Z" fill="currentColor"/>
            <path d="M3 12C3 11.4477 3.44772 11 4 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H4C3.44772 13 3 12.5523 3 12Z" fill="currentColor"/>
            <path d="M4 16C3.44772 16 3 16.4477 3 17C3 17.5523 3.44772 18 4 18H20C20.5523 18 21 17.5523 21 17C21 16.4477 20.5523 16 20 16H4Z" fill="currentColor"/>
          </svg>
        </div>
        <span className="font-bold text-xl tracking-tight text-white">
          <span className="text-amber-500">NU</span>VAULT<span className="text-amber-500">.</span>
        </span>
      </Link>
      
      {/* Premium button */}
      <div className="px-6 mb-8 relative z-10">
        <Link href="/pricing">
          <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-medium">
            <Crown className="h-4 w-4 mr-2" />
            Unlock all features
          </Button>
        </Link>
      </div>
      
      {/* Navigation links */}
      <nav className="flex-1 px-6 space-y-2 relative z-10">
        <Link 
          href="/dashboard" 
          className={`flex items-center py-3 px-4 rounded-lg transition-colors ${
            currentPage === 'dashboard' 
              ? 'bg-gray-800/80 text-white font-medium' 
              : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mr-3" />
          Dashboard
        </Link>
        
        <Link 
          href="/portfolio" 
          className={`flex items-center py-3 px-4 rounded-lg transition-colors ${
            currentPage === 'portfolio' 
              ? 'bg-gray-800/80 text-white font-medium' 
              : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
          }`}
        >
          <ChartBar className="w-5 h-5 mr-3" />
          Portfolio
        </Link>
        
        <Link 
          href="/boutique" 
          className={`flex items-center py-3 px-4 rounded-lg transition-colors ${
            currentPage === 'boutique' 
              ? 'bg-gray-800/80 text-white font-medium' 
              : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
          }`}
        >
          <Store className="w-5 h-5 mr-3" />
          Boutique
        </Link>
        
        <Link 
          href="/services" 
          className={`flex items-center py-3 px-4 rounded-lg transition-colors ${
            currentPage === 'services' 
              ? 'bg-gray-800/80 text-white font-medium' 
              : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
          }`}
        >
          <Settings className="w-5 h-5 mr-3" />
          Services
        </Link>
        
        <Link 
          href="/about" 
          className={`flex items-center py-3 px-4 rounded-lg transition-colors ${
            currentPage === 'about' 
              ? 'bg-gray-800/80 text-white font-medium' 
              : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
          }`}
        >
          <Info className="w-5 h-5 mr-3" />
          About Us
        </Link>
        
        <Link 
          href="/support" 
          className={`flex items-center py-3 px-4 rounded-lg transition-colors ${
            currentPage === 'support' 
              ? 'bg-gray-800/80 text-white font-medium' 
              : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
          }`}
        >
          <HelpCircle className="w-5 h-5 mr-3" />
          Support
        </Link>
      </nav>
      
      {/* User profile */}
      <div className="px-6 py-4 border-t border-gray-800 mt-auto relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium">M</span>
          </div>
          <div>
            <div className="text-white font-medium">Matt Labb</div>
            <div className="text-xs text-gray-400">Free Plan</div>
          </div>
        </div>
      </div>
    </div>
  );
} 