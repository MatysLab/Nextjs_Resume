'use client';

import React from 'react';
import { MarketplaceItem, MarketplaceItemProps } from './MarketplaceItem';

interface MarketplaceGridProps {
  items: Omit<MarketplaceItemProps, 'onViewDetails' | 'onContact'>[];
  onViewDetails?: (id: string) => void;
  onContact?: (id: string) => void;
  className?: string;
}

export function MarketplaceGrid({ 
  items, 
  onViewDetails, 
  onContact,
  className = ''
}: MarketplaceGridProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${className}`}>
      {items.map((item) => (
        <MarketplaceItem
          key={item.id}
          {...item}
          onViewDetails={onViewDetails}
          onContact={onContact}
        />
      ))}
    </div>
  );
} 