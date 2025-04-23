'use client';

import React from 'react';
import { Sidebar } from './sidebar';
import { TopHeader } from './top-header';

interface AppLayoutProps {
  children: React.ReactNode;
  currentPage?: 'dashboard' | 'services' | 'about' | 'support' | 'projects' | 'pricing' | 'boutique' | 'portfolio';
}

export function AppLayout({ children, currentPage = 'dashboard' }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-black">
      
      {/* Sidebar */}
      <Sidebar currentPage={currentPage} />
      
      {/* Top header */}
      <TopHeader />
      
      {/* Main content */}
      <main className="pt-14 pl-64">
        {children}
      </main>
    </div>
  );
} 