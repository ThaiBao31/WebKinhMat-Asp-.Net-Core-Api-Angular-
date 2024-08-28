import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Color } from '../product.model';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  private apiUrl = "/api/colors";

  constructor(private http: HttpClient, private authService: AuthService) {}

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

  getColors(): Observable<Color[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Color[]>(`${this.apiUrl}`, { headers });
  }

  updateColor(id: number, color: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put<any>(`${this.apiUrl}/${id}`, color, { headers });
  }

  deleteColor(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
  }

  addColor(color: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}`, color, { headers });
  }
}
