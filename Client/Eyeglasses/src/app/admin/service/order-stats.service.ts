import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderStatsService {
  private baseUrl = '/api/orderstats';

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

  getDailyOrderStats(date: Date) {
    const headers = this.getAuthHeaders();
    return this.http.get<{ 
        completedOrders: number, 
        pendingOrders: number, 
        cancelledOrders: number 
    }>(`${this.baseUrl}/daily-stats`, {
      params: { date: date.toISOString() },
      headers
    });
  }
}
