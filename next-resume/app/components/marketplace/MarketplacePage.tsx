'use client';

import React, { useState, useEffect } from 'react';
import { MarketplaceGrid } from './MarketplaceGrid';
import { AddItemForm } from './AddItemForm';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Plus, Search, Filter } from 'lucide-react';
import { getMarketplaceItems, getMarketplaceItemsByCategory, MarketplaceItem } from '@/app/services/marketplace';
import { auth } from '@/app/firebase/config';
import { useToast } from '@/app/components/ui/use-toast';

export default function MarketplacePage() {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const { toast } = useToast();

  // Fetch marketplace items
  const fetchItems = async () => {
    try {
      setLoading(true);
      setError('');
      
      let fetchedItems;
      if (categoryFilter && categoryFilter !== 'all') {
        fetchedItems = await getMarketplaceItemsByCategory(categoryFilter);
      } else {
        fetchedItems = await getMarketplaceItems();
      }
      
      setItems(fetchedItems);
      setFilteredItems(fetchedItems);
    } catch (err) {
      console.error('Error fetching marketplace items:', err);
      setError('Failed to load marketplace items');
      toast({
        title: "Error",
        description: "Failed to load marketplace items",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchItems();
  }, [categoryFilter]);

  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredItems(items);
    } else {
      const lowerCaseSearch = searchTerm.toLowerCase();
      const filtered = items.filter(item => 
        item.name.toLowerCase().includes(lowerCaseSearch) || 
        item.description.toLowerCase().includes(lowerCaseSearch)
      );
      setFilteredItems(filtered);
    }
  }, [searchTerm, items]);

  // Handle item details view
  const handleViewDetails = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      setSelectedItem(item);
      setIsDetailDialogOpen(true);
    }
  };

  // Handle contact seller
  const handleContact = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      setSelectedItem(item);
      // For now, just display contact information
      toast({
        title: `Contact ${item.sellerName}`,
        description: "Contact feature will be implemented soon.",
      });
    }
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Marketplace</h1>
          <p className="text-gray-400">Find and sell collectibles in our community marketplace</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              List New Item
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-4xl">
            <DialogHeader>
              <DialogTitle className="sr-only">Add New Item</DialogTitle>
            </DialogHeader>
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
      
      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search marketplace..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white"
          />
        </div>
        
        <div className="w-full md:w-64">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Card">Cards</SelectItem>
              <SelectItem value="Artwork">Artwork</SelectItem>
              <SelectItem value="Collectible">Collectibles</SelectItem>
              <SelectItem value="Antique">Antiques</SelectItem>
              <SelectItem value="Stamp">Stamps</SelectItem>
              <SelectItem value="Coin">Coins</SelectItem>
              <SelectItem value="Trading Card">Trading Cards</SelectItem>
              <SelectItem value="Comic Book">Comic Books</SelectItem>
              <SelectItem value="Book">Books</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Status Messages */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
        </div>
      )}
      
      {error && !loading && (
        <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-md mb-8">
          {error}
        </div>
      )}
      
      {!loading && !error && filteredItems.length === 0 && (
        <div className="text-center py-16">
          <p className="text-xl text-gray-400">No items found</p>
          <p className="text-gray-500 mt-2">
            {searchTerm ? 'Try a different search term' : 'Be the first to list something!'}
          </p>
        </div>
      )}
      
      {/* Marketplace Items */}
      {!loading && filteredItems.length > 0 && (
        <MarketplaceGrid 
          items={filteredItems.map(item => ({
            ...item,
            createdAt: item.createdAt
          }))}
          onViewDetails={handleViewDetails}
          onContact={handleContact}
        />
      )}
      
      {/* Item Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-4xl">
          {selectedItem ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl text-white">{selectedItem.name}</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Listed by {selectedItem.sellerName} on {formatDate(selectedItem.createdAt)}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                <div className="rounded-md overflow-hidden">
                  <img 
                    src={selectedItem.imageUrl || 'https://via.placeholder.com/600x400?text=No+Image'} 
                    alt={selectedItem.name}
                    className="w-full h-auto object-cover"
                  />
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Details</h3>
                    <p className="text-gray-300 mt-2">{selectedItem.description}</p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Category</span>
                    <span className="text-white font-medium">{selectedItem.category}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Price</span>
                    <span className="text-2xl font-bold text-white">${selectedItem.price.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t border-gray-800 pt-6">
                    <h3 className="text-lg font-semibold text-white mb-2">Seller Information</h3>
                    <div className="flex items-center">
                      <div 
                        className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden mr-3"
                        style={{ backgroundImage: selectedItem.sellerAvatar ? `url(${selectedItem.sellerAvatar})` : 'none' }}
                      >
                        {!selectedItem.sellerAvatar && <div className="w-full h-full flex items-center justify-center text-white">{selectedItem.sellerName.charAt(0)}</div>}
                      </div>
                      <div>
                        <p className="text-white font-medium">{selectedItem.sellerName}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => handleContact(selectedItem.id)}
                  >
                    Contact Seller
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <DialogHeader>
              <DialogTitle className="text-xl text-white">Item Details</DialogTitle>
              <DialogDescription className="text-gray-400">
                Loading item details...
              </DialogDescription>
            </DialogHeader>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 