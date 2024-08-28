export interface Product {
  productId: number;
  name: string;
  description: string;
  price: number;
  purchasePrice: number;
  quantity: number;
  categoryId: number;
  category: Category;
  brandId: number;
  brand: Brand;
  colorId: number;
  color: Color;
  genderId: number;
  gender: Gender;
  productImages?: ProductImage[];
  productReviews?: Review[];
  orderDetails?: OrderDetail[];
  cartItems?: CartItem[];
}

export interface Category {
  categoryId: number;
  name: string;
  products: Product[];
}

export interface Brand {
  brandId: number;
  name: string;
  products: Product[];
}

export interface Color {
  colorId: number;
  name: string;
  products: Product[];
}

export interface Gender {
  genderId: number;
  name: string;
  products: Product[];
}

export interface ProductImage {
  productImageId: number;
  imagePath: string;
  productId: number;
  product?: Product; // Optional
}

export interface Review {
  reviewId: number;
  rating: number;
  reviewText: string;
  reviewDate: string; // ISO Date string
  productId: number;
  product?: Product; // Optional
  userId: number;
  user?: User; // Optional
}

export interface OrderDetail {
  orderDetailId: number;
  orderId: number;
  order?: Order; // Optional
  productId: number;
  product?: Product; // Optional
  productName: string;
  quantity: number;
  price: number;
}

export interface CartItem {
  cartItemId: number;
  productId: number;
  cartId: number;
  quantity: number;
  product?: Product; // Optional
  cart?: Cart; // Optional
}

export interface Cart {
  cartId: number;
  userId: number;
  user?: User; // Optional
  cartItems: CartItem[];
}


export interface Order {
  orderId: number;
  userId: number;
  userName: string;  
  user?: User; 
  orderDate: string; 
  totalAmount: number;
  orderDetails: OrderDetail[];
  status: OrderStatus;
}

export interface User {
  userId: number;
  username: string;
  password: string; // Ensure this is handled securely
  email: string;
  fullName: string;
  address: string;
  phoneNumber: string;
  isAdmin: boolean;
  productReviews?: Review[];
  orders?: Order[];
  carts?: Cart[];
}


export enum OrderStatus {
  Pending = 0,
  Completed = 1,
  Cancelled = 2
}
