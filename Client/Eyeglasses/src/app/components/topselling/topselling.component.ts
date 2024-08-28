import { Component, OnInit } from '@angular/core';
import { TopsellingService } from '../../services/topselling.service';
import { Product } from '../../admin/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-topselling',
  templateUrl: './topselling.component.html',
  styleUrls: ['./topselling.component.scss']
})
export class TopsellingComponent implements OnInit {
  topSellingProducts: any[] = []; // Mảng để lưu trữ sản phẩm bán chạy nhất từ API
  products: Product[] = [];
  topProducts: Product[] = []; // Mảng để lưu trữ 5 sản phẩm bán chạy nhất
  productImages: { [key: number]: string } = {}; 

  constructor(private topsellingService: TopsellingService, private productService: ProductService) {}

  ngOnInit(): void {
    this.topsellingService.getTopSelling().subscribe(data => {
      this.topSellingProducts = data;
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(
      products => {
        this.products = products;
        
        // Lọc 5 sản phẩm bán chạy nhất dựa trên ProductId
        this.topProducts = this.products.filter(product =>
          this.topSellingProducts.some(top => top.productId === product.productId)
        );

        // Tải hình ảnh cho từng sản phẩm
        this.topProducts.forEach(product => {
          this.productService.getProductAvatar(product.productId).subscribe(
            avatar => {
              this.productImages[product.productId] = avatar.imageUrl;
            },
            error => {
              console.error(`Error fetching avatar for product ${product.productId}:`, error);
            }
          );
        });
      },
      error => {
        console.error('Error loading products:', error);
      }
    );
  }
}
