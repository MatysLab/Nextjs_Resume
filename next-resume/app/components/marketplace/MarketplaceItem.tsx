'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { motion } from 'framer-motion';

export interface MarketplaceItemProps {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  sellerName: string;
  sellerAvatar?: string;
  category: string;
  createdAt: Date;
  onViewDetails?: (id: string) => void;
  onContact?: (id: string) => void;
}

export function MarketplaceItem({
  id,
  name,
  description,
  price,
  imageUrl,
  sellerName,
  sellerAvatar,
  category,
  createdAt,
  onViewDetails,
  onContact
}: MarketplaceItemProps) {
  // Format date
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(createdAt);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full overflow-hidden bg-gray-900 border-gray-800 shadow-lg">
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
            alt={name}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
          <Badge className="absolute top-2 right-2 bg-blue-600">{category}</Badge>
        </div>
        
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-white">{name}</CardTitle>
          <CardDescription className="text-gray-400">
            Posted on {formattedDate}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pb-0">
          <p className="text-sm text-gray-300 line-clamp-2 mb-4">{description}</p>
          <p className="text-lg font-bold text-white">${price.toFixed(2)}</p>
          
          <div className="flex items-center mt-4">
            <div 
              className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden mr-2"
              style={{ backgroundImage: sellerAvatar ? `url(${sellerAvatar})` : 'none' }}
            >
              {!sellerAvatar && <div className="w-full h-full flex items-center justify-center text-white text-sm">{sellerName.charAt(0)}</div>}
            </div>
            <span className="text-sm text-gray-300">{sellerName}</span>
          </div>
        </CardContent>
        
        <CardFooter className="flex gap-2 pt-4">
          <Button 
            variant="outline" 
            className="flex-1 border-gray-700 text-white hover:bg-white/10"
            onClick={() => onViewDetails?.(id)}
          >
            Details
          </Button>
          <Button 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => onContact?.(id)}
          >
            Contact
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
} 