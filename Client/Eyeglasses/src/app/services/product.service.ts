import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../admin/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = "/api/products";
  private imgUrl = "/api/productImages";
  private baseUrl = '/api/productAvatar'; 

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  getProductAvatar(productId: number): Observable<{ imageUrl: string }> {
    if (!productId) {
      throw new Error('Product ID is required');
    }
    return this.http.get<{ imageUrl: string }>(`${this.baseUrl}/product/${productId}/avatar`);
  }
  
  getProductImages(productId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.imgUrl}/product/${productId}`);
  }
}
