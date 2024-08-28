import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../product.model';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = "/api/productadmin";

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
      'Authorization': `Bearer ${token}`
    });
  }

  getProducts(): Observable<Product[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Product[]>(`${this.apiUrl}`, { headers });
  }

  getProduct(id: number): Observable<Product> {
    const headers = this.getAuthHeaders();
    return this.http.get<Product>(`${this.apiUrl}/${id}`, { headers });
  }

  addProduct(product: Omit<Product, 'productId'>): Observable<Product> {
    const headers = this.getAuthHeaders();
    return this.http.post<Product>(`${this.apiUrl}`, product, { headers });
  }

  updateProduct(id: number, product: Product): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.put<void>(`${this.apiUrl}/${id}`, product, { headers });
  }

  deleteProduct(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }

  uploadProductImages(formData: FormData): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.post<void>('/api/productImages/upload', formData, { headers });
  }
}
