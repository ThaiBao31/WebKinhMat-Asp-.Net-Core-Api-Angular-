import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { FormsModule } from '@angular/forms';

import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminUserComponent } from './admin-user/admin-user.component';
import { AdminSidebarComponent } from './admin-sidebar/admin-sidebar.component';
import { AdminProductComponent } from './admin-product/admin-product.component';
import { AdminCategoryComponent } from './admin-category/admin-category.component';
import { AdminBrandComponent } from './admin-brand/admin-brand.component';
import { AdminColorComponent } from './admin-color/admin-color.component';
import { ProductImagesComponent } from './product-images/product-images.component';
import { AdminOrderComponent } from './admin-order/admin-order.component';
import { RevenueComponent } from './revenue/revenue.component';
import { OrderStatsComponent } from './order-stats/order-stats.component';



@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminUserComponent,
    AdminSidebarComponent,
    AdminProductComponent,
    AdminCategoryComponent,
    AdminBrandComponent,
    AdminColorComponent,
    ProductImagesComponent,
    AdminOrderComponent,
    RevenueComponent,
    OrderStatsComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class AdminModule { }
