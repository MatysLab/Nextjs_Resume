'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Badge } from '@/app/components/ui/badge';
import { formatCurrency } from '@/app/lib/utils';

export interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  owner: {
    name: string;
    avatar: string;
  };
  featured?: boolean;
}

interface GalleryViewProps {
  items: MarketplaceItem[];
  onItemClick: (item: MarketplaceItem) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({ items, onItemClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((item) => (
        <motion.div
          key={item.id}
          className="bg-[#111111] border border-gray-800 rounded-lg overflow-hidden cursor-pointer"
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
            borderColor: "rgba(245, 158, 11, 0.3)"
          }}
          transition={{ duration: 0.2 }}
          onClick={() => onItemClick(item)}
        >
          <div className="relative h-40 w-full">
            <Image
              src={item.image}
              alt={item.name}
              fill
              style={{ objectFit: 'cover' }}
              className="group-hover:scale-105 transition-transform duration-200"
            />
            {item.featured && (
              <div className="absolute top-2 right-2 text-white">
                <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">
                  Featured
                </Badge>
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-medium text-white mb-1 truncate">{item.name}</h3>
            <p className="text-white text-sm line-clamp-2 h-10 mb-2">{item.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-amber-400 font-bold">{formatCurrency(item.price)}</span>
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full overflow-hidden relative mr-1">
                  <Image
                    src={item.owner.avatar}
                    alt={item.owner.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <span className="text-xs text-white">{item.owner.name}</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Sample marketplace items for demonstration
export const sampleMarketplaceItems: MarketplaceItem[] = [
  {
    id: '1',
    name: 'Luxury Watch Collection',
    description: 'A curated collection of premium watches from renowned brands.',
    price: 12500,
    image: '/images/placeholder.jpg',
    category: 'Watches',
    owner: {
      name: 'John Doe',
      avatar: '/images/avatar-placeholder.jpg'
    },
    featured: true
  },
  {
    id: '2',
    name: 'Vintage Gold Coin',
    description: 'Rare 19th century gold coin in excellent condition.',
    price: 3200,
    image: '/images/placeholder.jpg',
    category: 'Collectibles',
    owner: {
      name: 'Sarah Miller',
      avatar: '/images/avatar-placeholder.jpg'
    }
  },
  {
    id: '3',
    name: 'Contemporary Art Piece',
    description: 'Original artwork by emerging artist, perfect for modern interiors.',
    price: 8750,
    image: '/images/placeholder.jpg',
    category: 'Art',
    owner: {
      name: 'Michael Chen',
      avatar: '/images/avatar-placeholder.jpg'
    }
  },
  {
    id: '4',
    name: 'Limited Edition Sneakers',
    description: 'Collector\'s edition sneakers, never worn, in original packaging.',
    price: 1800,
    image: '/images/placeholder.jpg',
    category: 'Fashion',
    owner: {
      name: 'Emma Johnson',
      avatar: '/images/avatar-placeholder.jpg'
    },
    featured: true
  },
  {
    id: '5',
    name: 'Classic Vinyl Records Set',
    description: 'Collection of rare vinyl records from the 60s and 70s.',
    price: 950,
    image: '/images/placeholder.jpg',
    category: 'Music',
    owner: {
      name: 'David Wilson',
      avatar: '/images/avatar-placeholder.jpg'
    }
  },
  {
    id: '6',
    name: 'Antique Pocket Watch',
    description: 'Beautifully preserved pocket watch from the early 20th century.',
    price: 2400,
    image: '/images/placeholder.jpg',
    category: 'Watches',
    owner: {
      name: 'Alexandra Park',
      avatar: '/images/avatar-placeholder.jpg'
    }
  }
]; 