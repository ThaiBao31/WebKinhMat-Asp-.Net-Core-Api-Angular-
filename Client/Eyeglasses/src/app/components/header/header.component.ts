import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ProductSearchService } from 'src/app/services/product-search.service';
import { Product } from 'src/app/admin/product.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isPromoHidden = false;
  private lastScrollTop = 0;
  isLoggedIn: boolean = false;
  searchQuery: string = '';
  products: Product[] = [];
  errorMessage: string = '';

  constructor(private loginService: LoginService, private router: Router, private productSearchService: ProductSearchService ) { }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    this.isPromoHidden = scrollTop > this.lastScrollTop;
    this.lastScrollTop = scrollTop;
  }

  onSearch(event: Event): void {
    event.preventDefault();
    if (this.searchQuery.trim()) {
      this.productSearchService.searchProducts(this.searchQuery).subscribe({
        next: (data) => {
          this.products = data;
          this.router.navigate(['/search'], { queryParams: { query: this.searchQuery } });
        },
        error: (error) => {
          this.errorMessage = 'Đã xảy ra lỗi khi tìm kiếm sản phẩm.';
        }
      });
    } else {
      this.errorMessage = 'Vui lòng nhập từ khóa tìm kiếm.';
    }
  }
  

  ngOnInit() {
    this.loginService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });
    this.loginService.checkLoginStatus();
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
  navigateToLogin() {
    this.router.navigate(['/sign-in']);
  }
}
