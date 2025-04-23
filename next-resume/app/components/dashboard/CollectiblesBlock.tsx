'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';

interface Collectible {
  id: string;
  name: string;
  grade: string;
  imageUrl: string;
}

interface CollectiblesBlockProps {
  collectibles: Collectible[];
  className?: string;
  title?: string;
  description?: string;
}

export default function CollectiblesBlock({ 
  collectibles,
  className = '',
  title = "Your Collectibles",
  description = "Your collection of graded cards and other assets"
}: CollectiblesBlockProps) {
  return (
    <Card className={`bg-gray-900 border-gray-800 shadow-lg ${className} h-full`}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">{title}</CardTitle>
        <CardDescription className="text-gray-400">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {collectibles.map((item) => (
            <motion.div
              key={item.id}
              className="border border-gray-800 rounded-md overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <img src={item.imageUrl} alt={item.name} className="w-full h-auto" />
              <div className="p-2 bg-gray-800">
                <p className="text-sm font-medium text-white">{item.name}</p>
                <p className="text-xs text-gray-400">Grade: {item.grade}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 