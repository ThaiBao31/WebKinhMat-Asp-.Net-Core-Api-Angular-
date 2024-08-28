import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { GetCartDTO, UpdateCartItemDTO } from '../../DTO/CartItemDTO';
import { OrderDTO, OrderDetailDTO } from '../../DTO/OrderDTO';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartId: number = 0;
  items: GetCartDTO[] = [];
  orderId: number | null = null;

  constructor(private cartService: CartService, private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCart().subscribe({
      next: (response) => {
        this.cartId = response.cartId;
        this.items = response.items;
      },
      error: (err) => {
        console.error('Failed to load cart', err);
      }
    });
  }

  updateQuantity(productId: number, newQuantity: number): void {
    const updateCartItemDto: UpdateCartItemDTO = {
      productId: productId,
      quantity: newQuantity
    };

    this.cartService.updateCartItem(updateCartItemDto).subscribe(
      response => {
        console.log('Cart item updated successfully:', response);
        this.loadCart(); // Reload cart to reflect the changes
      },
      error => {
        console.error('Error updating cart item:', error);
        alert(`Lỗi: ${error.error}`);
      }
    );
  }

  removeItem(productId: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?')) {
      this.cartService.removeFromCart(productId).subscribe(
        () => {
          console.log('Item removed successfully');
          this.loadCart(); 
        },
        error => {
          console.error('Error removing item:', error);
          alert(`Lỗi: ${error.error}`);
        }
      );
    }
  }

  placeOrder(): void {
    const orderDetails: OrderDetailDTO[] = this.items.map(item => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      price: item.productPrice
    }));

    const orderDTO: OrderDTO = {
      totalAmount: this.items.reduce((sum, item) => sum + item.productPrice * item.quantity, 0),
      orderDetails: orderDetails
    };

    this.orderService.placeOrder(orderDTO).subscribe(
      response => {
        console.log('Order placed successfully:', response);
        this.orderId = response.orderId;
        if (this.orderId) {
          this.orderService.updateOrderDetails(this.orderId, orderDetails).subscribe(
            () => {
              alert('Đặt hàng thành công!');
              this.items = [];
              this.loadCart(); 
            },
            error => {
              console.error('Error updating order details:', error);
              alert(`Lỗi: ${error.error}`);
            }
          );
        }
      },
      error => {
        console.error('Error placing order:', error);
        alert(`Lỗi: ${error.error}`);
      }
    );
  }
}
