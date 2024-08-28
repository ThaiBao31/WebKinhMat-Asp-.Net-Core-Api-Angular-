import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  private apiUrl = '/api/test'; // URL của API ASP.NET Core

  constructor(private http: HttpClient) { }

  getGlasses(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }
}

