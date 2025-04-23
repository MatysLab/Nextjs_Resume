'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/app/components/ui/app-layout';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Dialog, DialogContent, DialogTrigger } from '@/app/components/ui/dialog';
import { cn } from '@/app/lib/utils';
import { motion } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  Grid3X3,
  LayoutGrid,
  Tag,
  Sparkles,
  Star,
  Info,
  ShoppingBag
} from 'lucide-react';
import Image from 'next/image';
import { formatCurrency } from '@/app/lib/utils';
import { getMarketplaceItems, MarketplaceItem } from '@/app/services/marketplace';
import { AddItemForm } from '@/app/components/marketplace/AddItemForm';

export default function BoutiquePage() {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'gallery'>('gallery');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'price-low' | 'price-high' | 'popular'>('recent');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Featured categories with nice icons
  const featuredCategories = [
    { id: 'all', name: 'All Items', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'Card', name: 'Trading Cards', icon: <Grid3X3 className="w-4 h-4" /> },
    { id: 'Collectible', name: 'Collectibles', icon: <Star className="w-4 h-4" /> },
    { id: 'Antique', name: 'Antiques', icon: <Info className="w-4 h-4" /> },
    { id: 'Artwork', name: 'Artwork', icon: <Sparkles className="w-4 h-4" /> },
  ];

  useEffect(() => {
    fetchItems();
  }, []);

  // Fetch items from marketplace
  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await getMarketplaceItems();
      setItems(data);
      setFilteredItems(data);
    } catch (err) {
      console.error('Error fetching items:', err);
      setError('Failed to load boutique items');
    } finally {
      setLoading(false);
    }
  };

  // Apply filters when search query, category, or price range changes
  useEffect(() => {
    let results = [...items];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        item => 
          item.name.toLowerCase().includes(query) || 
          item.description.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      results = results.filter(item => item.category === selectedCategory);
    }

    // Apply price filter
    results = results.filter(
      item => item.price >= priceRange[0] && item.price <= priceRange[1]
    );

    // Apply sorting
    results = results.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'popular':
          // This would require a view count or likes field
          // For now, we'll sort by name as a placeholder
          return a.name.localeCompare(b.name);
        case 'recent':
        default:
          // Sort by creation date (newest first)
          return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });

    setFilteredItems(results);
  }, [searchQuery, selectedCategory, priceRange, sortBy, items]);

  // Get selected item details
  const selectedItem = selectedItemId 
    ? items.find(item => item.id === selectedItemId) || null
    : null;

  // Item card component
  const ItemCard = ({ item }: { item: MarketplaceItem }) => {
    return (
      <motion.div
        className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden cursor-pointer"
        whileHover={{ scale: 1.02, y: -5 }}
        transition={{ duration: 0.2 }}
        onClick={() => setSelectedItemId(item.id)}
      >
        <div className="aspect-[4/3] w-full relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/50 z-10" />
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
          <div className="absolute top-2 right-2 z-10">
            <div className="bg-amber-500 text-white text-xs font-medium px-2 py-1 rounded">
              {item.category}
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-medium text-white text-lg mb-1 truncate">{item.name}</h3>
          <p className="text-gray-400 text-sm line-clamp-2 h-10 mb-2">
            {item.description}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-amber-400 font-bold">{formatCurrency(item.price)}</span>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <ShoppingBag className="h-3 w-3" /> Add to Cart
            </Button>
          </div>
        </div>
      </motion.div>
    );
  };

  // Empty state component
  const EmptyState = () => (
    <div className="text-center py-16">
      <div className="bg-gray-800 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
        <Tag className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-xl font-medium text-white mb-2">No items found</h3>
      <p className="text-gray-400 max-w-md mx-auto mb-6">
        We couldn't find any items matching your criteria. Try adjusting your search or filters.
      </p>
      <Button variant="outline" onClick={() => {
        setSearchQuery('');
        setSelectedCategory('all');
        setPriceRange([0, 10000]);
        setSortBy('recent');
      }}>
        Reset Filters
      </Button>
    </div>
  );

  return (
    <AppLayout currentPage="boutique">
      <div className="container mx-auto px-6 py-8">
        {/* Hero section */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2 text-white">Boutique Marketplace</h1>
          <p className="text-gray-400">
            Discover premium collectibles from trusted sellers with professional presentation
          </p>
        </motion.div>
        
        {/* Search and filters bar */}
        <motion.div 
          className="bg-gray-900 rounded-lg p-4 mb-8 border border-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search for collectibles..." 
                className="pl-10 bg-gray-800 border-gray-700"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className={cn(showFilters && "bg-gray-800")}
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
              
              <div className="border-l border-gray-700 mx-2" />
              
              <Button 
                variant="outline" 
                className={cn(viewMode === 'grid' && "bg-gray-800")}
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                className={cn(viewMode === 'gallery' && "bg-gray-800")}
                onClick={() => setViewMode('gallery')}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-amber-600 hover:bg-amber-700 ml-2">
                    List an Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-4xl">
                  <AddItemForm
                    onSuccess={() => {
                      setIsAddDialogOpen(false);
                      fetchItems();
                    }}
                    onCancel={() => setIsAddDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          {/* Expanded filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {featuredCategories.map(category => (
                      <Button 
                        key={category.id} 
                        variant="outline" 
                        size="sm"
                        className={cn(
                          "flex items-center gap-1",
                          selectedCategory === category.id && "bg-gray-800 border-amber-500"
                        )}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        {category.icon}
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Price Range</h4>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number" 
                      className="bg-gray-800 border-gray-700" 
                      value={priceRange[0]}
                      onChange={e => setPriceRange([
                        Number(e.target.value), 
                        priceRange[1]
                      ])}
                      min={0}
                    />
                    <span>to</span>
                    <Input 
                      type="number" 
                      className="bg-gray-800 border-gray-700" 
                      value={priceRange[1]}
                      onChange={e => setPriceRange([
                        priceRange[0], 
                        Number(e.target.value)
                      ])}
                      min={priceRange[0]}
                    />
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Sort By</h4>
                  <div className="grid grid-cols-4 bg-gray-800 rounded-lg p-1">
                    <button
                      type="button"
                      className={cn(
                        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                        sortBy === 'recent' ? "bg-amber-500 text-gray-950" : "text-gray-400 hover:bg-gray-700"
                      )}
                      onClick={() => setSortBy('recent')}
                    >
                      Recent
                    </button>
                    <button
                      type="button"
                      className={cn(
                        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                        sortBy === 'price-low' ? "bg-amber-500 text-gray-950" : "text-gray-400 hover:bg-gray-700"
                      )}
                      onClick={() => setSortBy('price-low')}
                    >
                      Price: Low
                    </button>
                    <button
                      type="button"
                      className={cn(
                        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                        sortBy === 'price-high' ? "bg-amber-500 text-gray-950" : "text-gray-400 hover:bg-gray-700"
                      )}
                      onClick={() => setSortBy('price-high')}
                    >
                      Price: High
                    </button>
                    <button
                      type="button"
                      className={cn(
                        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                        sortBy === 'popular' ? "bg-amber-500 text-gray-950" : "text-gray-400 hover:bg-gray-700"
                      )}
                      onClick={() => setSortBy('popular')}
                    >
                      Popular
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
        
        {/* Loading state */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-amber-500"></div>
          </div>
        )}
        
        {/* Error state */}
        {error && !loading && (
          <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-md mb-8">
            {error}
          </div>
        )}
        
        {/* Empty state */}
        {!loading && !error && filteredItems.length === 0 && <EmptyState />}
        
        {/* Item grid */}
        {!loading && !error && filteredItems.length > 0 && (
          <motion.div 
            className={cn(
              "grid gap-6",
              viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {filteredItems.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </motion.div>
        )}
        
        {/* Item details dialog */}
        {selectedItem && (
          <Dialog open={!!selectedItemId} onOpenChange={open => !open && setSelectedItemId(null)}>
            <DialogContent className="bg-gray-900 border-gray-800 text-white p-0 max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="bg-black p-8 flex items-center justify-center">
                  {selectedItem.imageUrl ? (
                    <motion.img 
                      src={selectedItem.imageUrl} 
                      alt={selectedItem.name}
                      className="max-w-full max-h-[500px] object-contain rounded shadow-xl"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-800 flex items-center justify-center text-gray-500 rounded">
                      No Image Available
                    </div>
                  )}
                </div>
                
                <div className="p-8">
                  <div className="mb-2 flex items-center">
                    <span className="bg-amber-500 text-black text-xs font-medium px-2 py-1 rounded mr-2">
                      {selectedItem.category}
                    </span>
                    <span className="text-gray-400 text-sm">
                      Listed by {selectedItem.sellerName}
                    </span>
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-4">{selectedItem.name}</h2>
                  
                  <div className="mb-6">
                    <div className="text-3xl font-bold text-amber-500 mb-2">
                      {formatCurrency(selectedItem.price)}
                    </div>
                    <p className="text-gray-300 mt-4">{selectedItem.description}</p>
                  </div>
                  
                  <div className="space-y-4">
                    <Button className="w-full bg-amber-600 hover:bg-amber-700 py-6 text-lg">
                      <ShoppingBag className="h-5 w-5 mr-2" />
                      Add to Cart
                    </Button>
                    
                    <Button variant="outline" className="w-full">
                      Contact Seller
                    </Button>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-800">
                    <h3 className="font-medium mb-2">Item Details</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-gray-400">Condition</div>
                      <div>Excellent</div>
                      <div className="text-gray-400">Listed</div>
                      <div>{selectedItem.createdAt.toLocaleDateString()}</div>
                      <div className="text-gray-400">Category</div>
                      <div>{selectedItem.category}</div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AppLayout>
  );
} 