import { Component, OnInit, Input } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../admin/product.model';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent implements OnInit {
  filteredProducts: Product[] = [];
  productImages: { [key: number]: string } = {};

  @Input() products: Product[] = []; 
  @Input() selectedCategories: number[] = [];
  @Input() selectedBrands: number[] = [];
  @Input() selectedColors: number[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  ngOnChanges(): void {
    this.applyFilters();
    this.loadProductImages();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(
      products => {
        this.products = products;
        this.applyFilters();  // Apply filters after products are loaded
        this.loadProductImages();
      },
      error => {
        console.error('Error loading products:', error);
      }
    );
  }

  loadProductImages(): void {
    this.filteredProducts.forEach(product => {
      this.productService.getProductAvatar(product.productId).subscribe(
        avatar => {
          this.productImages[product.productId] = avatar.imageUrl;
        },
        error => {
          console.error(`Error fetching avatar for product ${product.productId}:`, error);
          this.productImages[product.productId] = 'default-image-url';
        }
      );
    });
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter(product => {
      return (
        (this.selectedCategories.length === 0 || this.selectedCategories.includes(product.categoryId)) &&
        (this.selectedBrands.length === 0 || this.selectedBrands.includes(product.brandId)) &&
        (this.selectedColors.length === 0 || this.selectedColors.includes(product.colorId))
      );
    });
    this.loadProductImages();
  }
}
