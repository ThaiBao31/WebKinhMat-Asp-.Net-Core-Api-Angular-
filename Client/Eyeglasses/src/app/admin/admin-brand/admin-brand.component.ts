import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BrandService } from '../service/brand.service';
import { Brand } from '../product.model';

@Component({
  selector: 'app-admin-brand',
  templateUrl: './admin-brand.component.html',
  styleUrls: ['./admin-brand.component.scss']
})
export class AdminBrandComponent implements OnInit {
  brands: Brand[] = []; // Mảng chứa danh sách thương hiệu
  currentPage: number = 1; // Trang hiện tại
  itemsPerPage: number = 7; // Số mục hiển thị trên mỗi trang
  totalPages: number = 1; // Tổng số trang
  showForm: boolean = false; // Trạng thái hiển thị form
  editMode: boolean = false; // Trạng thái chỉnh sửa
  brandForm: FormGroup; // Đối tượng FormGroup cho form thương hiệu
  selectedBrand!: Brand; // Thương hiệu được chọn để chỉnh sửa

  constructor(private brandService: BrandService, private fb: FormBuilder) {
    // Khởi tạo form với một trường 'name'
    this.brandForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadBrands(); // Tải danh sách thương hiệu khi component khởi tạo
  }

  loadBrands(): void {
    // Lấy danh sách thương hiệu từ BrandService
    this.brandService.getBrands().subscribe(
      (data) => {
        this.brands = data;
        this.totalPages = Math.ceil(this.brands.length / this.itemsPerPage); // Tính tổng số trang
      },
      (error) => {
        console.error('Error fetching brands:', error); // Xử lý lỗi khi lấy dữ liệu
      }
    );
  }

  goToPage(page: number): void {
    // Chuyển đến trang chỉ định
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
  }

  get paginatedBrands(): Brand[] {
    // Lấy các thương hiệu theo trang hiện tại
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.brands.slice(start, end);
  }

  get pageNumbers(): number[] {
    // Tạo mảng số trang để hiển thị
    const pages = [];
    const maxPagesToShow = 3;
    const startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  openAddBrandForm(): void {
    // Mở form thêm mới thương hiệu
    this.showForm = true;
    this.editMode = false;
    this.brandForm.reset();
  }

  editBrand(brand: Brand): void {
    // Mở form chỉnh sửa thương hiệu đã chọn
    this.selectedBrand = brand;
    this.brandForm.setValue({ name: brand.name });
    this.showForm = true;
    this.editMode = true;
  }

  saveBrand(): void {
    // Lưu thương hiệu mới hoặc cập nhật thương hiệu
    if (this.editMode) {
      const updatedBrand: Brand = {
        brandId: this.selectedBrand.brandId,
        name: this.brandForm.value.name,
        products: []
      };
  
      this.brandService.updateBrand(this.selectedBrand.brandId, updatedBrand).subscribe(
        () => {
          this.loadBrands(); // Tải lại danh sách sau khi cập nhật
          this.showForm = false;
          this.editMode = false;
        },
        (error) => {
          console.error('Error updating brand:', error);
          alert('Error updating brand: ' + JSON.stringify(error));
        }
      );
    } else {
      const newBrand: Omit<Brand, 'brandId'> = {
        name: this.brandForm.value.name,
        products: []
      };
  
      this.brandService.addBrand(newBrand).subscribe(
        () => {
          this.loadBrands(); // Tải lại danh sách sau khi thêm mới
          this.showForm = false;
        },
        (error) => {
          console.error('Error adding brand:', error);
          alert('Error adding brand: ' + JSON.stringify(error));
        }
      );
    }
  }
  
  cancel(): void {
    // Hủy thao tác và ẩn form
    this.showForm = false;
    this.editMode = false;
    this.brandForm.reset();
  }

  deleteBrand(id: number): void {
    // Xóa thương hiệu sau khi xác nhận
    if (confirm('Bạn có chắc chắn muốn xóa thương hiệu này?')) {
      this.brandService.deleteBrand(id).subscribe(
        () => {
          this.loadBrands(); // Tải lại danh sách sau khi xóa
        },
        (error) => {
          console.error('Error deleting brand:', error);
        }
      );
    }
  }
}
