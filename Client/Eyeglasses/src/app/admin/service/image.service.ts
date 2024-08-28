import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = '/api/productImages';

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


  getProductImages(productId: number): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/product/${productId}`,{headers});
  }

  deleteProductImage(imageId: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/delete/${imageId}`,{headers});
  }
}
