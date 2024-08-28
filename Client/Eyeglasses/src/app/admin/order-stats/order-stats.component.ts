import { Component, OnInit } from '@angular/core';
import { OrderStatsService } from '../service/order-stats.service';

@Component({
  selector: 'app-order-stats',
  templateUrl: './order-stats.component.html',
  styleUrls: ['./order-stats.component.scss']
})
export class OrderStatsComponent implements OnInit {
  dailyDate: string = this.formatDate(new Date()); // Khởi tạo với ngày hiện tại

  orderStats: { 
    completedOrders: number, 
    pendingOrders: number, 
    cancelledOrders: number 
  } = { completedOrders: 0, pendingOrders: 0, cancelledOrders: 0 };

  constructor(private orderStatsService: OrderStatsService) {}

  ngOnInit(): void {
    this.getDailyOrderStats(); // Tự động tính thống kê cho ngày hôm nay khi component được tải
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng từ 0-11, cần +1
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getDailyOrderStats() {
    const selectedDate = new Date(this.dailyDate);
    
    if (isNaN(selectedDate.getTime())) {
      alert('Ngày không hợp lệ');
      return;
    }
    
    this.orderStatsService.getDailyOrderStats(selectedDate).subscribe(data => {
      this.orderStats = data;
    });
  }
}
