import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'authToken'; // Đảm bảo sử dụng khóa 'authToken' nhất quán

  constructor() { }

  // Kiểm tra xem người dùng có đăng nhập không
  isLoggedIn(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    return !!token && !this.isTokenExpired(); // Đăng nhập nếu có token và chưa hết hạn
  }

  // Lấy token từ localStorage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Kiểm tra xem token có hết hạn hay không
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) {
      return true; // Token không tồn tại
    }

    try {
      const decodedToken: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);

      return decodedToken.exp < currentTime; // true nếu token đã hết hạn
    } catch (error) {
      console.error('Token decoding error:', error);
      return true; // Trả về true nếu có lỗi khi giải mã token
    }
  }

  // Lưu token vào localStorage
  setToken(token: string): void {
    console.log('Setting token:', token); // Ghi log để kiểm tra giá trị token
    localStorage.setItem(this.tokenKey, token);
  }

  // Xóa token khỏi localStorage
  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // Lấy thông tin người dùng từ token
  getUserFromToken() {
    const token = this.getToken(); // Sử dụng phương thức getToken() để lấy token
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        return {
          username: decodedToken['sub'], // Lấy username từ token
          userId: decodedToken['nameidentifier'], // Lấy userId từ token
          isAdmin: decodedToken['IsAdmin'] === 'true' // Kiểm tra quyền admin từ token
        };
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }
}
