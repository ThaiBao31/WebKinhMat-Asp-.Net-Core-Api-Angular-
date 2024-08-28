import { Component, Input, OnInit } from '@angular/core';
import { ImageService } from '../service/image.service';

@Component({
  selector: 'app-product-images',
  templateUrl: './product-images.component.html',
  styleUrls: ['./product-images.component.scss']
})
export class ProductImagesComponent implements OnInit {
  @Input() productId: number | null = null;
  productImages: any[] = [];

  constructor(private imageService: ImageService) { }

  ngOnInit(): void {
    if (this.productId !== null) {
      this.loadProductImages();
    }
  }

  
  loadProductImages(): void {
  if (this.productId !== null) {
    this.imageService.getProductImages(this.productId).subscribe(
      (images) => {
        this.productImages = images;
        console.log('Loaded images:', this.productImages);
        this.productImages.forEach(image => console.log('Image Path:', image.imagePath));
      },
      (error) => {
        console.error('Error loading images:', error);
      }
    );
  }
}

  

  // product-images.component.ts
deleteImage(imageId: number): void {
  console.log('Attempting to delete image with ID:', imageId);
  
  if (imageId) {
    this.imageService.deleteProductImage(imageId).subscribe(
      () => {
        this.loadProductImages();
      },
      (error) => {
        console.error('Error deleting image:', error);
      }
    );
  } else {
    console.error('Invalid image ID:', imageId);
  }
}

  
  
  
}
