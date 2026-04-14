import { Routes } from '@angular/router';
import { AddProduct } from './components/products/product-add/product-add';
import { EditProduct } from './components/products/product-edit/product-edit';
import { ProductsList } from './components/products/products-list/products-list';
import { Login } from './components/auth/login/login';
import { Register } from './components/auth/register/register';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'register' },
  { path: 'login', component: Login, title: 'Login' },
  { path: 'register', component: Register, title: 'Register' },

  { path: 'products', canActivate: [authGuard], component: ProductsList, },
  { path: 'products/add', canActivate: [authGuard], component: AddProduct, },
  { path: 'products/edit/:id', canActivate: [authGuard], component: EditProduct, },
  { path: '**', redirectTo: 'register', }
];
