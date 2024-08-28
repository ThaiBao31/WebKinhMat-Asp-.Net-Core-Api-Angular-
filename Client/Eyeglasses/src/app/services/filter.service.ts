import { Injectable } from '@angular/core';
import { HttpClient,HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../admin/product.model';
import { Brand } from '../admin/product.model';
import { Color } from '../admin/product.model';
import { Product } from '../admin/product.model';


@Injectable({
  providedIn: 'root'
})
export class FilterService {

  private baseUrl = '/api/filter'; 

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`);
  }

  getBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${this.baseUrl}/brands`);
  }

  getColors(): Observable<Color[]> {
    return this.http.get<Color[]>(`${this.baseUrl}/colors`);
  }

  filterProducts(categoryIds: number[], brandIds: number[], colorIds: number[]): Observable<Product[]> {
    let params = new HttpParams();

    if (categoryIds.length > 0) {
      params = params.append('categoryIds', categoryIds.join(','));
    }
    if (brandIds.length > 0) {
      params = params.append('brandIds', brandIds.join(','));
    }
    if (colorIds.length > 0) {
      params = params.append('colorIds', colorIds.join(','));
    }

    return this.http.get<Product[]>(`${this.baseUrl}/products`, { params });
  }
}

