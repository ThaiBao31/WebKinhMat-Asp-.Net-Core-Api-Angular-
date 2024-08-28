import { Component, OnInit } from '@angular/core';
import { OrderService } from '../service/order.service';
import { Order, OrderStatus } from '../product.model'; // Đảm bảo OrderStatus được import

@Component({
  selector: 'app-admin-order',
  templateUrl: './admin-order.component.html',
  styleUrls: ['./admin-order.component.scss']
})
export class AdminOrderComponent implements OnInit {
  orders: Order[] = [];
  selectedOrder: Order | null = null;
  paginatedOrders: Order[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalPages: number = 0;
  OrderStatus = OrderStatus; // Khai báo OrderStatus để có thể sử dụng trong template

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  selectOrder(order: Order): void {
    if (order && order.orderId) {
      this.orderService.getOrderDetails(order.orderId).subscribe(details => {
        this.selectedOrder = { ...order, orderDetails: details };
      });
    } else {
      console.error('Invalid order ID');
    }
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe(data => {
      this.orders = data;
      this.calculateTotalPages();
      this.updatePaginatedOrders();
    });
  }

  updateStatus(orderId: number, status: OrderStatus): void {
    this.orderService.updateOrderStatus(orderId, status).subscribe(() => {
      this.loadOrders(); // Tải lại danh sách đơn hàng sau khi cập nhật
    });
  }

  get paginatedOrdersList(): Order[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.orders.slice(start, end);
  }

  get pageNumbers(): number[] {
    const pages = [];
    const maxPagesToShow = 3;
    const startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.orders.length / this.itemsPerPage);
  }

  updatePaginatedOrders() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedOrders = this.orders.slice(start, end);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedOrders();
    }
  }

  cancel(): void {
    this.selectedOrder = null;
  }

  updateOrderStatus(order: Order): void {
    this.orderService.updateOrderStatus(order.orderId, order.status).subscribe(
      response => {
        console.log('Order status updated successfully:', response);
        this.loadOrders(); // Tải lại danh sách đơn hàng sau khi cập nhật
      },
      error => {
        console.error('Error updating order status:', error);
      }
    );
  }
  
  
}
