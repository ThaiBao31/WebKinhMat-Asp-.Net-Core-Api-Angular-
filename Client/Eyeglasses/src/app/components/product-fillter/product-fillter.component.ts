import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FilterService } from 'src/app/services/filter.service';
import { Category, Brand, Color, Product } from 'src/app/admin/product.model';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-fillter.component.html',
  styleUrls: ['./product-fillter.component.scss']
})
export class ProductFilterComponent implements OnInit {
  categories: Category[] = [];
  brands: Brand[] = [];
  colors: Color[] = [];

  selectedCategories: Set<number> = new Set();
  selectedBrands: Set<number> = new Set();
  selectedColors: Set<number> = new Set();

  @Output() filteredProducts: EventEmitter<Product[]> = new EventEmitter<Product[]>();  // Output event

  constructor(private filterService: FilterService) {}

  ngOnInit(): void {
    this.loadFilters(); // Load các thuộc tính để lọc từ server
  }

  loadFilters(): void {
    this.filterService.getCategories().subscribe(categories => this.categories = categories);
    this.filterService.getBrands().subscribe(brands => this.brands = brands);
    this.filterService.getColors().subscribe(colors => this.colors = colors);
  }

  onCategoryChange(categoryId: number, event: any): void {
    this.updateSelection(this.selectedCategories, categoryId, event.target.checked);
    this.applyFilters(); // Tự động áp dụng bộ lọc ngay khi có thay đổi
  }

  onBrandChange(brandId: number, event: any): void {
    this.updateSelection(this.selectedBrands, brandId, event.target.checked);
    this.applyFilters(); // Tự động áp dụng bộ lọc ngay khi có thay đổi
  }

  onColorChange(colorId: number, event: any): void {
    this.updateSelection(this.selectedColors, colorId, event.target.checked);
    this.applyFilters(); // Tự động áp dụng bộ lọc ngay khi có thay đổi
  }

  private updateSelection(set: Set<number>, value: number, checked: boolean): void {
    if (checked) {
      set.add(value);
    } else {
      set.delete(value);
    }
  }

  applyFilters(): void {
    const categoryIds = Array.from(this.selectedCategories);
    const brandIds = Array.from(this.selectedBrands);
    const colorIds = Array.from(this.selectedColors);

    this.filterService.filterProducts(categoryIds, brandIds, colorIds).subscribe(products => {
      this.filteredProducts.emit(products);  // Emit sản phẩm đã lọc cho component cha
    });
  }
}
