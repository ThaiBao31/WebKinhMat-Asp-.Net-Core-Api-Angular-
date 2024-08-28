import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { tap } from 'rxjs/operators';
import { OrderDTO, OrderDetailDTO } from '../DTO/OrderDTO';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = '/api/orders';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();

    if (!token) {
      console.error('Token not found');
      throw new Error('Token not found');
    }

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  placeOrder(orderDTO: OrderDTO): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/place-order`, orderDTO, { headers }).pipe(
      tap((response: any) => {
        console.log('Order placed successfully:', response);
      })
    );
  }

  updateOrderDetails(orderId: number, orderDetails: OrderDetailDTO[]): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/update-order-details/${orderId}`, orderDetails, { headers }).pipe(
      tap((response: any) => {
        console.log('Order details updated successfully:', response);
      })
    );
  }
}
