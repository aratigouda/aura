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
  image: string;
  description: string;
  category: string;
  createdAt: string;
}

export interface OrderProduct {
  name: string;
  price: number;
  qty: number;
  image: string;
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
}
