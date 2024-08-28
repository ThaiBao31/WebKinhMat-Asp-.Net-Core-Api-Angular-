import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderDetail, OrderStatus } from '../product.model';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = "/api/orderadmin";

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

  getOrders(): Observable<Order[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Order[]>(`${this.apiUrl}`, { headers });
  }

  getOrderDetails(id: number): Observable<OrderDetail[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<OrderDetail[]>(`${this.apiUrl}/details/${id}`, { headers });
  }

  updateOrderStatus(id: number, status: OrderStatus): Observable<any> {
    const headers = this.getAuthHeaders();
    const statusString = OrderStatus[status];
    const body = { status: statusString };
    console.log(`Gửi yêu cầu cập nhật trạng thái. OrderId: ${id}, Status: ${statusString}`);
    return this.http.put<any>(`${this.apiUrl}/update-status/${id}`, body, { headers });
}
  
  
  
}
