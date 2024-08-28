import { Component } from '@angular/core';
import { RegisterService } from 'src/app/services/register.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  user: any = {
    fullName: '',
    username: '',
    password: '',
    email: '',
    phoneNumber: '',
    confirm: false
  };

  constructor(private registerService: RegisterService) { }

  register() {
    if (!this.user.confirm) {
      alert('Bạn cần xác nhận để tiếp tục.');
      return;
    }

    this.registerService.register(this.user).subscribe(
      response => {
        alert(response.message || 'Đăng ký thành công');
        // Xử lý thành công (chuyển hướng người dùng, v.v.)
      },
      error => {
        alert('Có lỗi xảy ra: ' + (error.error || 'Không thể đăng ký'));
        // Xử lý lỗi
      }
    );
  }
}
