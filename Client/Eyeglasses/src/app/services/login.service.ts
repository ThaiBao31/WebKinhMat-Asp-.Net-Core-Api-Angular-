import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = '/api/login';
  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.loggedInSubject.asObservable();

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password });
  }

  logout(): void {
    localStorage.removeItem('authToken'); // Xóa token chính xác
    this.loggedInSubject.next(false); // Cập nhật trạng thái đăng nhập
  }
  
  checkLoginStatus(): void {
    this.loggedInSubject.next(this.hasToken());
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('authToken'); // Đảm bảo khóa khớp với khóa lưu token
  }
  
}
