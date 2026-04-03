export interface Restaurant {
  id: string;
  name: string;
  image: string;
  cuisine: string[];
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: number;
  featured: boolean;
  description: string;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  popular: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  addedBy?: string; // for group orders
}

export interface Order {
  id: string;
  items: CartItem[];
  status: OrderStatus;
  total: number;
  deliveryAddress: string;
  scheduledFor?: Date;
  isSubscription: boolean;
  createdAt: Date;
}

export type OrderStatus =
  | "placed"
  | "preparing"
  | "ready"
  | "picked_up"
  | "arrived"
  | "delivered";

export interface GroupOrderSession {
  id: string;
  hostName: string;
  participants: string[];
  items: CartItem[];
  isOpen: boolean;
}

export interface UserProfile {
  name: string;
  xp: number;
  rank: string;
  ordersCount: number;
  totalSpent: number;
}

export const CATEGORIES = [
  "All",
  "Tagine",
  "Pizza",
  "Grills",
  "Desserts",
  "Burgers",
  "Moroccan",
  "Sandwiches",
  "Drinks",
] as const;

export type Category = (typeof CATEGORIES)[number];
