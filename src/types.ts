export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice: number;
  image: string;
  description: string;
  category: string;
  inStock: boolean;
  rating: number;
  reviews: number;
  createdAt: string;
  isWishlisted?: boolean;
}

export interface OrderProduct {
  name: string;
  price: number;
  qty: number;
  image?: string;
}

export interface Order {
  orderId: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  products: OrderProduct[];
  total: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  rating?: number;
}

export interface CartItem extends Product {
  quantity: number;
  cartItemId: string;
}
