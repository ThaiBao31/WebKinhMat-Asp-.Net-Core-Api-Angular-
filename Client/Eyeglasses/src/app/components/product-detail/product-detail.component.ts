import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../admin/product.model';
import { AuthService } from '../../services/auth.service';
import { CartItemDTO } from '../../DTO/CartItemDTO';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;
  productThumbnailImages: string[] = [];
  selectedImage: string | undefined;
  currentImageIndex: number = 0;
  addToCartSuccess: boolean = false;
  addToCartError: string | null = null;
  cartId: number = 0; 

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProduct();
    const token = this.authService.getToken();
    console.log('Retrieved token:', token);
    this.someMethod();
  
  }

  loadProduct(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    if (productId) {
      this.productService.getProduct(productId).subscribe(
        product => {
          this.product = product;
          this.loadProductImages(productId);
        },
        error => {
          console.error('Error loading product:', error);
        }
      );
    }
  }

  loadProductImages(productId: number): void {
    this.productService.getProductImages(productId).subscribe(
      images => {
        this.productThumbnailImages = images.map(image => image.imagePath);
        this.selectedImage = this.productThumbnailImages[0];
      },
      error => {
        console.error(`Error fetching images for product ${productId}:`, error);
      }
    );
  }

  onThumbnailClick(image: string): void {
    this.selectedImage = image;
    this.currentImageIndex = this.productThumbnailImages.indexOf(image);
  }

  prevImage(): void {
    if (this.productThumbnailImages.length > 0) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.productThumbnailImages.length) % this.productThumbnailImages.length;
      this.selectedImage = this.productThumbnailImages[this.currentImageIndex];
    }
  }

  nextImage(): void {
    if (this.productThumbnailImages.length > 0) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.productThumbnailImages.length;
      this.selectedImage = this.productThumbnailImages[this.currentImageIndex];
    }
  }

  addToCart(): void {
    if (!this.authService.isLoggedIn()) {
      console.log('User not logged in. Redirecting to login.');
      this.router.navigate(['/login']); // Chuyển hướng đến trang đăng nhập
      return;
    }
  
    if (this.product) {
      const cartItem: CartItemDTO = {
        cartId: this.cartId,
        productId: this.product.productId,
        quantity: 1
      };
  
      this.cartService.addToCart(cartItem).subscribe(
        response => {
          this.addToCartSuccess = true;
          this.addToCartError = null;
          console.log('Product added to cart:', response);
        },
        error => {
          this.addToCartError = 'Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng';
          this.addToCartSuccess = false;
          console.error('Error adding product to cart:', error);
        }
      );
    }
  }
  

  someMethod() {
    if (this.authService.isTokenExpired()) {
      console.log('Token đã hết hạn.');
      // Xử lý khi token hết hạn (ví dụ: yêu cầu đăng nhập lại)
    } else {
      console.log('Token còn hiệu lực.');
      // Thực hiện các hành động khác
    }
  }
}
