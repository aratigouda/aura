import { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Silk Floral Maxi Dress',
    price: 129.99,
    description: 'A beautiful silk maxi dress with delicate floral patterns, perfect for summer evenings.',
    category: 'Dresses',
    images: ['https://picsum.photos/seed/dress1/600/800'],
    colors: ['Rose', 'Cream'],
    sizes: ['XS', 'S', 'M', 'L'],
    isTrending: true
  },
  {
    id: '2',
    name: 'Handwoven Banarasi Saree',
    price: 249.99,
    description: 'Exquisite handwoven Banarasi silk saree with intricate gold zari work.',
    category: 'Sarees',
    images: ['https://picsum.photos/seed/saree1/600/800'],
    colors: ['Crimson', 'Emerald'],
    sizes: ['Free Size'],
    isTrending: true
  },
  {
    id: '3',
    name: 'Embroidered Chiffon Top',
    price: 59.99,
    description: 'Elegant chiffon top with hand-embroidered details on the neckline.',
    category: 'Tops',
    images: ['https://picsum.photos/seed/top1/600/800'],
    colors: ['White', 'Lavender'],
    sizes: ['S', 'M', 'L', 'XL'],
    isNew: true
  },
  {
    id: '4',
    name: 'Linen Wide-Leg Trousers',
    price: 79.99,
    description: 'Breathable linen trousers with a flattering wide-leg silhouette.',
    category: 'Bottoms',
    images: ['https://picsum.photos/seed/bottom1/600/800'],
    colors: ['Beige', 'Sage'],
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    id: '5',
    name: 'Velvet Evening Gown',
    price: 189.99,
    description: 'Luxurious velvet gown with a side slit and elegant draping.',
    category: 'Dresses',
    images: ['https://picsum.photos/seed/dress2/600/800'],
    colors: ['Midnight Blue', 'Wine'],
    sizes: ['S', 'M', 'L'],
    isTrending: true
  },
  {
    id: '6',
    name: 'Cotton Chikankari Kurta',
    price: 89.99,
    description: 'Traditional Lucknowi Chikankari embroidery on soft breathable cotton.',
    category: 'Tops',
    images: ['https://picsum.photos/seed/top2/600/800'],
    colors: ['Peach', 'Sky Blue'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    isNew: true
  }
];
