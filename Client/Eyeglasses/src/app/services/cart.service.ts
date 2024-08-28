import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { CartItemDTO, GetCartDTO,UpdateCartItemDTO } from '../DTO/CartItemDTO';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartUrl = '/api/cart';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
  
    if (!token) {
      console.error('Token not found');
      throw new Error('Token not found');
    }
  
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('JWT is not well formed:', token);
      throw new Error('JWT is not well formed');
    }
  
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  addToCart(cartItem: CartItemDTO): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.cartUrl}/add`, cartItem, { headers }).pipe(
      tap((response: any) => { // Thêm kiểu 'any' hoặc kiểu cụ thể của response nếu biết.
        console.log('Product added to cart:', response);
      })
    );
  }
  
  getCart(): Observable<{ cartId: number; items: GetCartDTO[] }> {
    const headers = this.getAuthHeaders();
    return this.http.get<{ cartId: number; items: GetCartDTO[] }>(`${this.cartUrl}`, { headers });
  }

  updateCartItem(updateCartItemDto: UpdateCartItemDTO): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.cartUrl}/update`, updateCartItemDto, { headers }).pipe(
      tap((response: any) => {
        console.log('Cart updated:', response);
      })
    );
  }

  removeFromCart(productId: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.cartUrl}/remove/${productId}`, { headers }).pipe(
      tap(() => {
        console.log('Product removed from cart');
      })
    );
  }

}


  
  



