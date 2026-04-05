import { Routes } from '@angular/router';
import { AddProduct } from './components/products/product-add/product-add';
import { EditProduct } from './components/products/product-edit/product-edit';
import { ProductsList } from './components/products/products-list/products-list';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'products', },
  { path: 'products', component: ProductsList, },
  { path: 'products/add', component: AddProduct, },
  { path: 'products/edit/:id', component: EditProduct, },
  { path: '**', redirectTo: 'products', },
];



