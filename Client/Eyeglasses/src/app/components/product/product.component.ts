import { Component } from '@angular/core';
import { Product } from '../../admin/product.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  filteredProducts: Product[] = [];

  onFilteredProducts(products: Product[]): void {
    this.filteredProducts = products;
  }
}
