'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { useToast } from '@/app/components/ui/use-toast';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/app/firebase/config';
import { auth } from '@/app/firebase/config';
import { NativeDropzone } from '@/app/components/ui/native-dropzone';
import { ImageEnhancer } from '@/app/components/marketplace/ImageEnhancer';
import { cn } from '@/app/lib/utils';
import { Wand2, Upload, Image as ImageIcon, Check } from 'lucide-react';

// Item categories
const ITEM_CATEGORIES = [
  'Card',
  'Artwork',
  'Collectible',
  'Antique',
  'Stamp',
  'Coin',
  'Trading Card',
  'Comic Book',
  'Book',
  'Other'
];

interface AddItemFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AddItemForm({ onSuccess, onCancel }: AddItemFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Card');
  const [condition, setCondition] = useState('Used');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [enhancedImage, setEnhancedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStep, setFormStep] = useState<'details' | 'image' | 'enhance'>('details');
  const { toast } = useToast();

  // Handle image upload
  const handleImageUpload = (files: File[]) => {
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      
      reader.readAsDataURL(file);
      setImage(file);
    }
  };

  // Handle enhanced image from the enhancer component
  const handleEnhancedImage = (enhancedFile: File) => {
    setEnhancedImage(enhancedFile);
    // Show success toast
    toast({
      title: "Image Enhanced",
      description: "Your product image has been professionally enhanced.",
    });
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name || !description || !price || !category) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (!auth.currentUser) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to post items.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Upload image if provided
      let imageUrl = '';
      if (enhancedImage || image) {
        const fileToUpload = enhancedImage || image;
        const storageRef = ref(storage, `marketplace/${auth.currentUser.uid}/${Date.now()}_${fileToUpload!.name}`);
        const snapshot = await uploadBytes(storageRef, fileToUpload!);
        imageUrl = await getDownloadURL(snapshot.ref);
      }
      
      // Add document to Firestore
      const docRef = await addDoc(collection(db, 'marketplace'), {
        name,
        description,
        price: parseFloat(price),
        category,
        condition,
        imageUrl,
        sellerName: auth.currentUser.displayName || 'Anonymous',
        sellerAvatar: auth.currentUser.photoURL || '',
        sellerId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        views: 0,
        featured: false
      });
      
      toast({
        title: "Item Posted",
        description: "Your item has been successfully listed in the marketplace.",
      });
      
      // Reset form
      setName('');
      setDescription('');
      setPrice('');
      setCategory('Card');
      setCondition('Used');
      setImage(null);
      setImagePreview('');
      setEnhancedImage(null);
      setFormStep('details');
      
      // Call success callback
      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error("Error adding item:", error);
      toast({
        title: "Error",
        description: "Failed to add your item. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-800 shadow-xl">
      <CardHeader>
        <CardTitle className="text-white text-xl">List Your Item</CardTitle>
        <CardDescription className="text-gray-400">
          Create a professional listing for your collectible item
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="w-full">
          <div className="grid grid-cols-3 mb-6 rounded-lg bg-gray-800 p-1">
            <button
              type="button"
              className={cn(
                "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                formStep === 'details' ? "bg-amber-500 text-gray-950" : "text-gray-400 hover:bg-gray-700"
              )}
              onClick={() => setFormStep('details')}
            >
              <span className="bg-gray-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
              Item Details
            </button>
            <button
              type="button"
              className={cn(
                "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                formStep === 'image' ? "bg-amber-500 text-gray-950" : "text-gray-400 hover:bg-gray-700"
              )}
              onClick={() => setFormStep('image')}
            >
              <span className="bg-gray-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
              Upload Photo
            </button>
            <button
              type="button"
              className={cn(
                "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                formStep === 'enhance' ? "bg-amber-500 text-gray-950" : "text-gray-400 hover:bg-gray-700"
              )}
              onClick={() => setFormStep('enhance')}
            >
              <span className="bg-gray-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
              Enhance
            </button>
          </div>
          
          {/* Item Details */}
          {formStep === 'details' && (
            <form>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Item Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g. Charizard Holo 1st Edition"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="e.g. 299.99"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectGroup>
                          <SelectLabel>Categories</SelectLabel>
                          {ITEM_CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition</Label>
                    <Select value={condition} onValueChange={setCondition}>
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectGroup>
                          <SelectLabel>Condition</SelectLabel>
                          <SelectItem value="New">New</SelectItem>
                          <SelectItem value="Like New">Like New</SelectItem>
                          <SelectItem value="Excellent">Excellent</SelectItem>
                          <SelectItem value="Good">Good</SelectItem>
                          <SelectItem value="Fair">Fair</SelectItem>
                          <SelectItem value="Poor">Poor</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your item, including important details like condition, rarity, etc."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-gray-800 border-gray-700 min-h-[120px]"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                {onCancel && (
                  <Button
                    type="button"
                    onClick={onCancel}
                    variant="ghost"
                    className="mr-2"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                )}
                <Button 
                  type="button" 
                  onClick={() => setFormStep('image')}
                  disabled={!name || !description || !price || !category}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  Continue to Photo
                </Button>
              </div>
            </form>
          )}
          
          {/* Image Upload */}
          {formStep === 'image' && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">Upload Product Photo</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Add a high-quality photo of your item. Better photos increase your chances of selling.
                </p>
              </div>
              
              {!imagePreview ? (
                <NativeDropzone
                  onDrop={handleImageUpload}
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="h-64"
                />
              ) : (
                <div className="bg-gray-800 rounded-lg overflow-hidden">
                  <div className="p-2 bg-gray-700 text-sm text-gray-300 flex justify-between items-center">
                    <span>Image Preview</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setImage(null);
                        setImagePreview('');
                      }}
                    >
                      Change
                    </Button>
                  </div>
                  <div className="p-4 flex items-center justify-center">
                    <img
                      src={imagePreview}
                      alt="Item preview"
                      className="max-h-56 max-w-full object-contain"
                    />
                  </div>
                </div>
              )}
              
              <div className="mt-6 flex justify-between">
                <Button 
                  type="button"
                  onClick={() => setFormStep('details')}
                  variant="outline"
                >
                  Back to Details
                </Button>
                
                <Button 
                  type="button"
                  onClick={() => setFormStep('enhance')}
                  disabled={!image}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  {image ? 'Enhance Photo' : 'Please Upload a Photo'}
                </Button>
              </div>
            </div>
          )}
          
          {/* Image Enhancement */}
          {formStep === 'enhance' && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-medium mb-2">Enhance Your Product Photo</h3>
                <p className="text-gray-400 text-sm">
                  Make your listing stand out with professional-looking photos
                </p>
              </div>
              
              <ImageEnhancer 
                originalImage={image} 
                onEnhancedImage={handleEnhancedImage}
              />
              
              <div className="mt-6 flex justify-between">
                <Button 
                  type="button"
                  onClick={() => setFormStep('image')}
                  variant="outline"
                >
                  Back to Upload
                </Button>
                
                <Button 
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  {isSubmitting ? 'Listing Item...' : 'List Item Now'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 