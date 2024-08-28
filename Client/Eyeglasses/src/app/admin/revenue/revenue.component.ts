import { Component, OnInit } from '@angular/core';
import { RevenueService } from '../service/revenue.service';

@Component({
  selector: 'app-revenue',
  templateUrl: './revenue.component.html',
  styleUrls: ['./revenue.component.scss']
})
export class RevenueComponent implements OnInit {
  dailyDate: string = this.formatDate(new Date()); // Khởi tạo với giá trị ngày hiện tại
  monthlyMonth: number = new Date().getMonth() + 1; // Khởi tạo với giá trị tháng hiện tại
  monthlyYear: number = new Date().getFullYear(); // Khởi tạo với giá trị năm hiện tại
  yearlyYear: number = new Date().getFullYear(); // Khởi tạo với giá trị năm hiện tại

  dailyRevenue: { revenue: number } = { revenue: 0 }; // Khởi tạo với giá trị mặc định
  monthlyRevenue: { revenue: number } = { revenue: 0 }; // Khởi tạo với giá trị mặc định
  yearlyRevenue: { revenue: number } = { revenue: 0 }; // Khởi tạo với giá trị mặc định

  constructor(private revenueService: RevenueService) {}

  ngOnInit(): void {
    this.getDailyRevenue(); // Tự động tính doanh thu ngày hôm nay khi component được tải
    this.getMonthlyRevenue(); // Tự động tính doanh thu của tháng hiện tại
    this.getYearlyRevenue(); // Tự động tính doanh thu của năm hiện tại
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getDailyRevenue() {
    const selectedDate = new Date(this.dailyDate);
    this.revenueService.getDailyRevenue(selectedDate).subscribe(data => {
      console.log(data);
      this.dailyRevenue = data;
    });
  }

  getMonthlyRevenue() {
    this.revenueService.getMonthlyRevenue(this.monthlyMonth, this.monthlyYear).subscribe(data => {
      console.log(data);
      this.monthlyRevenue = data;
    });
  }

  getYearlyRevenue() {
    this.revenueService.getYearlyRevenue(this.yearlyYear).subscribe(data => {
      console.log(data);
      this.yearlyRevenue = data;
    });
  }
}
