'use client';

import Link from 'next/link';
import React from 'react';
import { Store, ChartBar } from 'lucide-react';

interface HeaderProps {
  currentPage?: 'dashboard' | 'services' | 'about' | 'support' | 'projects' | 'pricing' | 'boutique' | 'portfolio';
}

export function Header({ currentPage = 'dashboard' }: HeaderProps) {
  return (
    <header className="border-b border-gray-800 bg-black px-5 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center">
          <div className="w-8 h-8 bg-amber-500 flex items-center justify-center rounded-sm mr-2">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-black">
              <path d="M3 7C3 6.44772 3.44772 6 4 6H20C20.5523 6 21 6.44772 21 7C21 7.55228 20.5523 8 20 8H4C3.44772 8 3 7.55228 3 7Z" fill="currentColor"/>
              <path d="M3 12C3 11.4477 3.44772 11 4 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H4C3.44772 13 3 12.5523 3 12Z" fill="currentColor"/>
              <path d="M4 16C3.44772 16 3 16.4477 3 17C3 17.5523 3.44772 18 4 18H20C20.5523 18 21 17.5523 21 17C21 16.4477 20.5523 16 20 16H4Z" fill="currentColor"/>
            </svg>
          </div>
          <span className="font-bold text-xl tracking-tight">
            <span className="text-amber-500">NU</span>VAULT<span className="text-amber-500">.</span>
          </span>
        </Link>
        <div className="hidden md:flex space-x-8">
          <Link 
            href="/dashboard" 
            className={`${currentPage === 'dashboard' ? 'text-white font-medium' : 'text-gray-300 hover:text-white'}`}
          >
            Dashboard
          </Link>
          <Link 
            href="/portfolio" 
            className={`${currentPage === 'portfolio' ? 'text-white font-medium' : 'text-gray-300 hover:text-white'} flex items-center gap-1`}
          >
            <ChartBar className="w-4 h-4" />
            Portfolio
          </Link>
          <Link 
            href="/boutique" 
            className={`${currentPage === 'boutique' ? 'text-white font-medium' : 'text-gray-300 hover:text-white'} flex items-center gap-1`}
          >
            <Store className="w-4 h-4" />
            Boutique
          </Link>
          <Link 
            href="/services" 
            className={`${currentPage === 'services' ? 'text-white font-medium' : 'text-gray-300 hover:text-white'}`}
          >
            Services
          </Link>
          <Link 
            href="/about" 
            className={`${currentPage === 'about' ? 'text-white font-medium' : 'text-gray-300 hover:text-white'}`}
          >
            About Us
          </Link>
          <Link 
            href="/support" 
            className={`${currentPage === 'support' ? 'text-white font-medium' : 'text-gray-300 hover:text-white'}`}
          >
            Support
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative rounded-full bg-gray-800 px-3">
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent py-1 text-sm focus:outline-none w-32 md:w-48"
            />
          </div>
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium">M</span>
          </div>
        </div>
      </div>
    </header>
  );
} 