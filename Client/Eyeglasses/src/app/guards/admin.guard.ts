import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; 

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const user = this.authService.getUserFromToken(); // Lấy user từ token
    if (user && user.isAdmin) {
      return true; // Cho phép truy cập nếu là admin
    } else {
      this.router.navigate(['/login']); // Chuyển hướng đến trang login nếu không phải admin
      return false;
    }
  }
}
