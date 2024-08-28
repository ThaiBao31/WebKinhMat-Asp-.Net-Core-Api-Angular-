import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms'; 

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { FooterComponent } from './components/footer/footer.component';
import { MainComponent } from './components/main/main.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { ProductItemComponent } from './components/product-item/product-item.component';
import { ProductComponent } from './components/product/product.component';
import { ProductFilterComponent } from './components/product-fillter/product-fillter.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CartComponent } from './components/cart/cart.component';
import { TopsellingComponent } from './components/topselling/topselling.component';
import { ProductSearchComponent } from './components/product-search/product-search.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    SignupComponent,
    FooterComponent,
    MainComponent,
    AdminLayoutComponent,
    ProductItemComponent,
    ProductComponent,
    ProductFilterComponent,
    ProductDetailComponent,
    CartComponent,
    TopsellingComponent,
    ProductSearchComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
