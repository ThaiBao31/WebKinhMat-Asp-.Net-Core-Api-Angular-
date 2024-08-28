export interface CartItemDTO {
    cartId: number; 
    productId: number;
    quantity: number;
  }
  
  export interface GetCartDTO {
    productId: number;
    productName: string;
    productPrice: number;
    quantity: number;
    totalPrice: number;
    productDescription: string;
  }
  
  export interface UpdateCartItemDTO {
    productId: number;
    quantity: number;
  }
  