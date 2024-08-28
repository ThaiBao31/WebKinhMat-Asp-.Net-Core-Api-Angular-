import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../admin/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductSearchService {
  private apiUrl = '/api/products'; 

  constructor(private http: HttpClient) {}

  searchProducts(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/search?query=${query}`);
  }
}
