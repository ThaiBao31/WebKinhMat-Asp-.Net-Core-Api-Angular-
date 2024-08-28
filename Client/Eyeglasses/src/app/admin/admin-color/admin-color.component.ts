import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColorService } from '../service/color.service';
import { Color } from '../product.model';

@Component({
  selector: 'app-admin-color',
  templateUrl: './admin-color.component.html',
  styleUrls: ['./admin-color.component.scss']
})
export class AdminColorComponent implements OnInit {
  colors: Color[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 7;
  totalPages: number = 1;
  showForm: boolean = false;
  editMode: boolean = false;
  colorForm: FormGroup;
  selectedColor!: Color;

  constructor(private colorService: ColorService, private fb: FormBuilder) { 
    this.colorForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadColors();
  }

  loadColors(): void {
    this.colorService.getColors().subscribe(
      (data) => {
        this.colors = data;
        this.totalPages = Math.ceil(this.colors.length / this.itemsPerPage);
      },
      (error) => {
        console.error('Error fetching colors:', error);
      }
    );
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
  }

  get paginatedColors(): Color[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.colors.slice(start, end);
  }

  get pageNumbers(): number[] {
    const pages = [];
    const maxPagesToShow = 3;
    const startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  openAddColorForm(): void {
    this.showForm = true;
    this.editMode = false;
    this.colorForm.reset();
  }

  editColor(color: Color): void {
    this.selectedColor = color;
    this.colorForm.setValue({ name: color.name });
    this.showForm = true;
    this.editMode = true;
  }

  saveColor(): void {
    if (this.editMode) {
      const updatedColor = {
        colorId: this.selectedColor.colorId,
        name: this.colorForm.value.name,
        products: []
      };
  
      this.colorService.updateColor(this.selectedColor.colorId, updatedColor).subscribe(
        () => {
          this.loadColors();
          this.showForm = false;
          this.editMode = false;
        },
        (error) => {
          console.error('Error updating color:', error);
          alert('Error updating color: ' + JSON.stringify(error));
        }
      );
    } else {
      const newColor = {
        name: this.colorForm.value.name,
        products: []
      };
  
      this.colorService.addColor(newColor).subscribe(
        () => {
          this.loadColors();
          this.showForm = false;
        },
        (error) => {
          console.error('Error adding color:', error);
          alert('Error adding color: ' + JSON.stringify(error));
        }
      );
    }
  }
  
  cancel(): void {
    this.showForm = false;
    this.editMode = false;
    this.colorForm.reset();
  }

  deleteColor(id: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa màu này?')) {
      this.colorService.deleteColor(id).subscribe(
        () => {
          this.loadColors();
        },
        (error) => {
          console.error('Error deleting color:', error);
        }
      );
    }
  }
}
