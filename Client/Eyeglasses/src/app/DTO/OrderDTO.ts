export interface OrderDetailDTO {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
  }
  
  export interface OrderDTO {
    totalAmount: number;
    orderDetails: OrderDetailDTO[];
  }
  
  