import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private loginService: LoginService, private router: Router) { }

  login() {
    console.log('Login function called');
    this.loginService.login(this.username, this.password).subscribe(response => {
      console.log('Login successful', response);
      const token = response.token;
      if (token) {
        localStorage.setItem('authToken', token); // Đảm bảo khóa khớp
        this.loginService.checkLoginStatus(); // Cập nhật trạng thái đăng nhập
        this.router.navigate(['/']);
      } else {
        console.error('No token found in response');
        alert('Login failed');
      }
    }, error => {
      console.error('Login failed', error);
      alert('Login failed');
    });
  }
  
}
