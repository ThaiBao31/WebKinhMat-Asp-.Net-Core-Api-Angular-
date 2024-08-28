import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RevenueService {
  private baseUrl = '/api/revenue';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Token not found');
    }

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getDailyRevenue(date: Date) {
    const headers = this.getAuthHeaders();
    const isoDate = new Date(date).toISOString(); // Chuyển đổi thành ISO format
    return this.http.get<{ revenue: number }>(`${this.baseUrl}/daily`, {
      params: { date: isoDate },
      headers
    });
}


  getMonthlyRevenue(month: number, year: number) {
    const headers = this.getAuthHeaders();
    return this.http.get<{ revenue: number, profit: number }>(`${this.baseUrl}/monthly`, {
      params: { month, year },
      headers
    });
  }

  getYearlyRevenue(year: number) {
    const headers = this.getAuthHeaders();
    return this.http.get<{ revenue: number, profit: number }>(`${this.baseUrl}/yearly`, {
      params: { year },
      headers
    });
  }
}
