import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminUserComponent } from './admin-user/admin-user.component';
import { AdminProductComponent } from './admin-product/admin-product.component';
import { AdminCategoryComponent } from './admin-category/admin-category.component';
import { AdminColorComponent } from './admin-color/admin-color.component';
import { AdminBrandComponent } from './admin-brand/admin-brand.component';
import { AdminOrderComponent } from './admin-order/admin-order.component';
import { RevenueComponent } from './revenue/revenue.component';


const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'user', component: AdminUserComponent },
      { path: 'product', component: AdminProductComponent },
      { path: 'category', component: AdminCategoryComponent },
      { path: 'color', component: AdminColorComponent },
      { path: 'brand', component: AdminBrandComponent },
      { path: 'order', component: AdminOrderComponent },
      { path: 'revenue', component: RevenueComponent } 
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
