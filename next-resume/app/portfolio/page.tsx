'use client';

import React from 'react';
import { AppLayout } from '@/app/components/ui/app-layout';
import { PortfolioSection } from '@/app/components/portfolio/portfolio-section';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, PieChart, BarChart4 } from 'lucide-react';

export default function PortfolioPage() {
  return (
    <AppLayout currentPage="portfolio">
      <div className="container mx-auto px-6 py-8">
        {/* Hero section */}
        <div className="mb-8">
          <motion.h1 
            className="text-3xl font-bold mb-2 text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Portfolio Dashboard
          </motion.h1>
          <motion.p 
            className="text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Track and manage your assets and investments in one place
          </motion.p>
        </div>
        
        {/* Stats overview */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">Total Value</h3>
              <Wallet className="h-5 w-5 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-white">$91,240.00</p>
            <p className="text-green-500 text-sm mt-1">+2.4% this month</p>
          </div>
          
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">Performance</h3>
              <TrendingUp className="h-5 w-5 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-white">+12.5%</p>
            <p className="text-green-500 text-sm mt-1">+5.2% vs. last year</p>
          </div>
          
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">Diversification</h3>
              <PieChart className="h-5 w-5 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-white">8 Categories</p>
            <p className="text-blue-500 text-sm mt-1">Balanced portfolio</p>
          </div>
          
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">Market Trend</h3>
              <BarChart4 className="h-5 w-5 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-white">Bullish</p>
            <p className="text-green-500 text-sm mt-1">Markets up 3.2%</p>
          </div>
        </motion.div>
        
        {/* Portfolio main section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <PortfolioSection />
        </motion.div>
      </div>
    </AppLayout>
  );
} 