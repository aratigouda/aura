export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'Dresses' | 'Sarees' | 'Tops' | 'Bottoms';
  images: string[];
  colors: string[];
  sizes: string[];
  isTrending?: boolean;
  isNew?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role?: 'user' | 'admin';
}
