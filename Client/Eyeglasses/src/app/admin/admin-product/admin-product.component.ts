import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../service/product.service';
import { Product } from '../product.model';
import { Category } from '../product.model';
import { Brand } from '../product.model';
import { Color } from '../product.model';
import { CategoryService } from '../service/category.service';
import { BrandService } from '../service/brand.service';
import { ColorService } from '../service/color.service';
import { priceValidator } from './priceValidator';

@Component({
  selector: 'app-admin-product',
  templateUrl: './admin-product.component.html',
  styleUrls: ['./admin-product.component.scss']
})
export class AdminProductComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  brands: Brand[] = [];
  colors: Color[] = [];

  paginatedProducts: Product[] = [];
  productForm: FormGroup;
  uploadImageForm: FormGroup;
  showForm: boolean = false;
  showUploadForm: boolean = false;
  editMode: boolean = false;
  displayedPages: number[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 7;
  showImages: boolean = false; // Thay đổi trạng thái hiển thị ảnh
  totalPages: number = 1;
  selectedProductId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private colorService: ColorService

  ) {
    this.productForm = this.fb.group({
      productId: [{ value: '', disabled: true }],
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      purchasePrice: [0, [Validators.required, Validators.min(0)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      categoryId: [0, Validators.required],
      brandId: [0, Validators.required],
      colorId: [0, Validators.required]
    }, { validator: priceValidator() });

    this.uploadImageForm = this.fb.group({
      image: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.loadBrands();
    this.loadColors();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(products => {
      console.log('Products loaded:', products); // Kiểm tra dữ liệu sản phẩm
      this.products = products;
      this.paginateProducts();
    }, error => {
      console.error('Error loading products:', error); // Kiểm tra lỗi nếu có
    });
  }

  loadCategories(): void {
    this.categoryService.getCategorys().subscribe(categories => {
      this.categories = categories;
    }, error => {
      console.error('Error loading categories:', error);
    });
  }
  
  loadBrands(): void {
    this.brandService.getBrands().subscribe(brands => {
      this.brands = brands;
    }, error => {
      console.error('Error loading brands:', error);
    });
  }
  
  loadColors(): void {
    this.colorService.getColors().subscribe(colors => {
      this.colors = colors;
    }, error => {
      console.error('Error loading colors:', error);
    });
  }
  
  onSubmit(): void {
    if (this.productForm.valid) {
      const formValue = this.productForm.getRawValue();
      if (this.editMode) {
        this.updateProduct(formValue.productId, formValue);
      } else {
        this.addProduct(formValue);
      }
    } else {
      console.log('Form is invalid');
    }
  }

  paginateProducts(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedProducts = this.products.slice(start, end);
    this.totalPages = Math.ceil(this.products.length / this.itemsPerPage);
    this.updateDisplayedPages();
  }

  updateDisplayedPages(): void {
    const numberOfPagesToShow = 3;
    const halfPages = Math.floor(numberOfPagesToShow / 2);

    if (this.totalPages <= numberOfPagesToShow) {
      this.displayedPages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    } else {
      if (this.currentPage <= halfPages) {
        this.displayedPages = Array.from({ length: numberOfPagesToShow }, (_, i) => i + 1);
      } else if (this.currentPage > this.totalPages - halfPages) {
        this.displayedPages = Array.from({ length: numberOfPagesToShow }, (_, i) => this.totalPages - numberOfPagesToShow + i + 1);
      } else {
        this.displayedPages = Array.from({ length: numberOfPagesToShow }, (_, i) => this.currentPage - halfPages + i);
      }
    }
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.paginateProducts();
  }

  openAddProductForm(): void {
    this.productForm.reset();
    this.editMode = false;
    this.showForm = true;
  }

  openUpdateProductForm(product: Product): void {
    this.productForm.patchValue(product);
    this.editMode = true;
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.productForm.reset();
  }



  addProduct(newProduct: Omit<Product, 'productId'>): void {
    this.productService.addProduct(newProduct).subscribe(
      () => {
        this.loadProducts();
        this.closeForm();
      },
      (error) => {
        console.error('Error adding product:', error);
      }
    );
  }

  updateProduct(id: number, updatedProduct: Product): void {
    this.productService.updateProduct(id, updatedProduct).subscribe(
      () => {
        this.loadProducts();
        this.closeForm();
      },
      (error) => {
        console.error('Error updating product:', error);
      }
    );
  }

  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe(() => {
      this.loadProducts();
    });
  }

  openUploadImageForm(productId: number): void {
    this.selectedProductId = productId;
    this.uploadImageForm.reset();
    this.showUploadForm = true;
  }

  closeUploadForm(): void {
    this.showUploadForm = false;
    this.uploadImageForm.reset();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploadImageForm.patchValue({
        image: file
      });
    }
  }
  openProductImagesForm(productId: number): void {
    this.selectedProductId = productId;
    this.showImages = true;
  }

  closeImagesForm(): void {
    this.showImages = false;
    this.selectedProductId = null;
  }
  
  onUpload(): void {
    if (this.uploadImageForm.valid && this.selectedProductId !== null) {
      const formData = new FormData();
      formData.append('ProductId', this.selectedProductId.toString());
      formData.append('Images', this.uploadImageForm.get('image')?.value);

      this.productService.uploadProductImages(formData).subscribe(
        () => {
          this.loadProducts();
          this.closeUploadForm();
        },
        (error) => {
          console.error('Error uploading image:', error);
        }
      );
    }
  }
}
