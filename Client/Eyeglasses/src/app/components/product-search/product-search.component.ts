// product-search.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductSearchService } from 'src/app/services/product-search.service';
import { ProductService } from 'src/app/services/product.service'; // Import ProductService
import { Product } from 'src/app/admin/product.model'; // Import Product model

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss']
})
export class ProductSearchComponent implements OnInit {
  products: Product[] = [];
  productImages: { [key: number]: string } = {}; // To store product images
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private productSearchService: ProductSearchService,
    private productService: ProductService // Inject ProductService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const query = params['query'];
      if (query) {
        this.search(query);
      }
    });
  }

  search(query: string): void {
    this.productSearchService.searchProducts(query).subscribe({
      next: (data) => {
        this.products = data;
        this.loadProductImages(); // Load product images
      },
      error: (error) => (this.errorMessage = 'An error occurred while searching for products.'),
    });
  }

  loadProductImages(): void {
    this.products.forEach(product => {
      this.productService.getProductAvatar(product.productId).subscribe(
        avatar => {
          this.productImages[product.productId] = avatar.imageUrl;
        },
        error => {
          console.error(`Error fetching avatar for product ${product.productId}:`, error);
          this.productImages[product.productId] = 'default-image-url'; // Fallback image
        }
      );
    });
  }
}
