import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TopsellingService {
  private apiUrl = "/api/TopSelling/top-selling-products"; // Cập nhật URL

  constructor(private http: HttpClient) {}

  getTopSelling(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
