import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, getDocs, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';
import { Product } from '../types';

interface WishlistContextType {
  wishlistCount: number;
  wishlistIds: string[];
  toggleWishlist: (product: Product) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      setWishlistCount(0);
      setWishlistIds([]);
      return;
    }

    const q = query(
      collection(db, "wishlist"),
      where("userId", "==", user.uid)
    );

    const unsub = onSnapshot(q, (snap) => {
      setWishlistCount(snap.size);
      setWishlistIds(snap.docs.map(d => d.data().productId));
    });

    return () => unsub();
  }, [user]);

  const toggleWishlist = async (product: Product) => {
    if (!user) return;

    try {
      const q = query(
        collection(db, "wishlist"),
        where("userId", "==", user.uid),
        where("productId", "==", product.id)
      );

      const snap = await getDocs(q);

      if (!snap.empty) {
        // Remove
        const deletePromises = snap.docs.map(docItem => 
          deleteDoc(doc(db, "wishlist", docItem.id))
        );
        await Promise.all(deletePromises);
      } else {
        // Add
        await addDoc(collection(db, "wishlist"), {
          userId: user.uid,
          productId: product.id,
          name: product.name,
          price: Number(product.price),
          image: product.image,
          oldPrice: product.oldPrice || Number(product.price) * 1.2,
          inStock: product.inStock ?? true,
          rating: product.rating || 4.5,
          reviews: product.reviews || 0
        });
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistIds.includes(productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlistCount, wishlistIds, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
