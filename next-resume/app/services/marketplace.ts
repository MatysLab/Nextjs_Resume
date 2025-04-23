'use client';

import { collection, query, getDocs, where, orderBy, limit, doc, getDoc, deleteDoc, addDoc, serverTimestamp, updateDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage, auth } from '@/app/firebase/config';

export interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  sellerName: string;
  sellerAvatar?: string;
  sellerId: string;
  category: string;
  createdAt: Date;
  views?: number;
  condition?: string;
  featured?: boolean;
}

// Get all marketplace items
export async function getMarketplaceItems(): Promise<MarketplaceItem[]> {
  try {
    const q = query(
      collection(db, 'marketplace'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const items: MarketplaceItem[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      items.push({
        id: doc.id,
        name: data.name,
        description: data.description,
        price: data.price,
        imageUrl: data.imageUrl || '',
        sellerName: data.sellerName,
        sellerAvatar: data.sellerAvatar || '',
        sellerId: data.sellerId,
        category: data.category,
        createdAt: data.createdAt?.toDate() || new Date(),
        views: data.views || 0,
        condition: data.condition || 'Used',
        featured: data.featured || false
      });
    });
    
    return items;
  } catch (error) {
    console.error('Error getting marketplace items:', error);
    throw error;
  }
}

// Get marketplace items by category
export async function getMarketplaceItemsByCategory(category: string): Promise<MarketplaceItem[]> {
  try {
    const q = query(
      collection(db, 'marketplace'),
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const items: MarketplaceItem[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      items.push({
        id: doc.id,
        name: data.name,
        description: data.description,
        price: data.price,
        imageUrl: data.imageUrl || '',
        sellerName: data.sellerName,
        sellerAvatar: data.sellerAvatar || '',
        sellerId: data.sellerId,
        category: data.category,
        createdAt: data.createdAt?.toDate() || new Date(),
        views: data.views || 0,
        condition: data.condition || 'Used',
        featured: data.featured || false
      });
    });
    
    return items;
  } catch (error) {
    console.error('Error getting marketplace items by category:', error);
    throw error;
  }
}

// Get marketplace items by seller
export async function getMarketplaceItemsBySeller(sellerId: string): Promise<MarketplaceItem[]> {
  try {
    const q = query(
      collection(db, 'marketplace'),
      where('sellerId', '==', sellerId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const items: MarketplaceItem[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      items.push({
        id: doc.id,
        name: data.name,
        description: data.description,
        price: data.price,
        imageUrl: data.imageUrl || '',
        sellerName: data.sellerName,
        sellerAvatar: data.sellerAvatar || '',
        sellerId: data.sellerId,
        category: data.category,
        createdAt: data.createdAt?.toDate() || new Date(),
        views: data.views || 0,
        condition: data.condition || 'Used',
        featured: data.featured || false
      });
    });
    
    return items;
  } catch (error) {
    console.error('Error getting marketplace items by seller:', error);
    throw error;
  }
}

// Get featured marketplace items
export async function getFeaturedMarketplaceItems(limit = 6): Promise<MarketplaceItem[]> {
  try {
    const q = query(
      collection(db, 'marketplace'),
      where('featured', '==', true),
      orderBy('createdAt', 'desc'),
      limit
    );
    
    const querySnapshot = await getDocs(q);
    const items: MarketplaceItem[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      items.push({
        id: doc.id,
        name: data.name,
        description: data.description,
        price: data.price,
        imageUrl: data.imageUrl || '',
        sellerName: data.sellerName,
        sellerAvatar: data.sellerAvatar || '',
        sellerId: data.sellerId,
        category: data.category,
        createdAt: data.createdAt?.toDate() || new Date(),
        views: data.views || 0,
        condition: data.condition || 'Used',
        featured: data.featured || false
      });
    });
    
    return items;
  } catch (error) {
    console.error('Error getting featured marketplace items:', error);
    throw error;
  }
}

// Get single marketplace item
export async function getMarketplaceItem(itemId: string): Promise<MarketplaceItem | null> {
  try {
    const docRef = doc(db, 'marketplace', itemId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name,
        description: data.description,
        price: data.price,
        imageUrl: data.imageUrl || '',
        sellerName: data.sellerName,
        sellerAvatar: data.sellerAvatar || '',
        sellerId: data.sellerId,
        category: data.category,
        createdAt: data.createdAt?.toDate() || new Date(),
        views: data.views || 0,
        condition: data.condition || 'Used',
        featured: data.featured || false
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting marketplace item:', error);
    throw error;
  }
}

// Increment view count for an item
export async function incrementItemViews(itemId: string): Promise<void> {
  try {
    const itemRef = doc(db, 'marketplace', itemId);
    await updateDoc(itemRef, {
      views: +'1' // Using increment operator in Firebase
    });
  } catch (error) {
    console.error('Error incrementing item views:', error);
    throw error;
  }
}

// Delete marketplace item
export async function deleteMarketplaceItem(itemId: string): Promise<void> {
  try {
    // First get the item to check permissions and get image URL
    const itemRef = doc(db, 'marketplace', itemId);
    const itemSnap = await getDoc(itemRef);
    
    if (!itemSnap.exists()) {
      throw new Error('Item not found');
    }
    
    const data = itemSnap.data();
    
    // Check if current user is the seller
    if (!auth.currentUser || auth.currentUser.uid !== data.sellerId) {
      throw new Error('Unauthorized: You can only delete your own listings');
    }
    
    // Delete image from storage if it exists
    if (data.imageUrl) {
      try {
        const imageRef = ref(storage, data.imageUrl);
        await deleteObject(imageRef);
      } catch (error) {
        console.error('Error deleting image:', error);
        // Continue with deletion even if image deletion fails
      }
    }
    
    // Delete the document
    await deleteDoc(itemRef);
  } catch (error) {
    console.error('Error deleting marketplace item:', error);
    throw error;
  }
}

// Create a quick listing from portfolio asset
export async function createQuickListing(
  name: string,
  description: string,
  price: number,
  category: string
): Promise<string> {
  try {
    if (!auth.currentUser) {
      throw new Error('You must be logged in to create a listing');
    }
    
    const docRef = await addDoc(collection(db, 'marketplace'), {
      name,
      description,
      price,
      category,
      imageUrl: '', // Default empty image URL
      sellerName: auth.currentUser.displayName || 'Anonymous',
      sellerAvatar: auth.currentUser.photoURL || '',
      sellerId: auth.currentUser.uid,
      createdAt: serverTimestamp(),
      views: 0,
      condition: 'Used',
      featured: false
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating quick listing:', error);
    throw error;
  }
} 