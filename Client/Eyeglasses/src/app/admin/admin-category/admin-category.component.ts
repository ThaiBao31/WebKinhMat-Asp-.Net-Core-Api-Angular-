import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../service/category.service';
import { Category } from '../product.model';

@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.scss']
})
export class AdminCategoryComponent implements OnInit {
  // Mảng chứa danh sách danh mục
  categorys: Category[] = [];
  // Trang hiện tại
  currentPage: number = 1;
  // Số mục trên mỗi trang
  itemsPerPage: number = 7;
  // Tổng số trang
  totalPages: number = 1;
  // Hiển thị form thêm/sửa danh mục
  showForm: boolean = false;
  // Chế độ chỉnh sửa
  editMode: boolean = false;
  // Form quản lý danh mục
  categoryForm: FormGroup;
  // Danh mục đang được chọn để chỉnh sửa
  selectedCategory!: Category;

  // Constructor để tiêm dịch vụ và khởi tạo form
  constructor(private categoryService: CategoryService, private fb: FormBuilder) { 
    this.categoryForm = this.fb.group({
      name: ['', Validators.required] // Trường tên danh mục với xác thực yêu cầu
    });
  }

  // Lifecycle hook gọi khi component được khởi tạo
  ngOnInit(): void {
    this.loadCategorys(); // Tải danh sách danh mục khi khởi tạo
  }

  // Tải danh sách danh mục từ dịch vụ
  loadCategorys(): void {
    this.categoryService.getCategorys().subscribe(
      (data) => {
        this.categorys = data;
        // Tính tổng số trang dựa trên số lượng danh mục
        this.totalPages = Math.ceil(this.categorys.length / this.itemsPerPage);
      },
      (error) => {
        console.error('Error fetching categorys:', error);
      }
    );
  }

  // Điều hướng đến trang cụ thể
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
  }

  // Lấy các danh mục hiển thị trên trang hiện tại
  get paginatedCategorys(): Category[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.categorys.slice(start, end);
  }

  // Lấy số trang để hiển thị trong phân trang
  get pageNumbers(): number[] {
    const pages = [];
    const maxPagesToShow = 3; // Số trang tối đa hiển thị
    const startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Mở form để thêm danh mục mới
  openAddCategoryForm(): void {
    this.showForm = true;
    this.editMode = false;
    this.categoryForm.reset(); // Đặt lại form
  }

  // Mở form để chỉnh sửa danh mục hiện tại
  editCategory(category: Category): void {
    this.selectedCategory = category;
    this.categoryForm.setValue({ name: category.name }); // Điền dữ liệu vào form
    this.showForm = true;
    this.editMode = true;
  }

  // Lưu danh mục mới hoặc cập nhật danh mục hiện tại
  saveCategory(): void {
    if (this.editMode) {
      const updatedCategory = {
        categoryId: this.selectedCategory.categoryId,
        name: this.categoryForm.value.name,
        products: [] // Cập nhật các sản phẩm nếu cần
      };
  
      this.categoryService.updateCategory(this.selectedCategory.categoryId, updatedCategory).subscribe(
        () => {
          this.loadCategorys(); // Tải lại danh mục sau khi cập nhật
          this.showForm = false;
          this.editMode = false;
        },
        (error) => {
          console.error('Error updating category:', error);
          alert('Error updating category: ' + JSON.stringify(error));
        }
      );
    } else {
      const newCategory = {
        name: this.categoryForm.value.name,
        products: [] // Thêm các sản phẩm nếu cần
      };
  
      this.categoryService.addCategory(newCategory).subscribe(
        () => {
          this.loadCategorys(); // Tải lại danh mục sau khi thêm
          this.showForm = false;
        },
        (error) => {
          console.error('Error adding category:', error);
          alert('Error adding category: ' + JSON.stringify(error));
        }
      );
    }
  }
  
  // Hủy form và đóng lại
  cancel(): void {
    this.showForm = false;
    this.editMode = false;
    this.categoryForm.reset(); // Đặt lại form
  }

  // Xóa danh mục sau khi xác nhận
  deleteCategory(id: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      this.categoryService.deleteCategory(id).subscribe(
        () => {
          this.loadCategorys(); // Tải lại danh mục sau khi xóa
        },
        (error) => {
          console.error('Error deleting category:', error);
        }
      );
    }
  }
}
