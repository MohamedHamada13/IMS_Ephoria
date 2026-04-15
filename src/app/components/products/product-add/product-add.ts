import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import type { IProduct } from '../../../models/IProduct';
import { ProductService } from '../../../services/product.service';

type NewProduct = Omit<IProduct, 'id'>;

@Component({
  selector: 'app-add-product',
  imports: [ReactiveFormsModule],
  templateUrl: './product-add.html',
  styleUrl: './product-add.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddProduct {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly productService = inject(ProductService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isSaving = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly createdProduct = signal<IProduct | null>(null);

  readonly productForm = this.fb.group({
    name: this.fb.control('', [Validators.required, Validators.maxLength(100)]),
    price: this.fb.control(0, [Validators.required, Validators.min(0)]),
    quantity: this.fb.control(0, [Validators.required, Validators.min(0)]),
    category: this.fb.control('', [Validators.required, Validators.maxLength(50)]),
  });

  onAddProduct(): void {
    if (this.isSaving()) return;

    this.createdProduct.set(null);

    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const payload: NewProduct = this.productForm.getRawValue();

    this.isSaving.set(true);
    this.errorMessage.set(null);

    const subscription = this.productService.addProduct(payload).subscribe({
      next: (created) => {
        this.createdProduct.set(created);
        this.productForm.reset({ name: '', price: 0, quantity: 0, category: '' });
        this.isSaving.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to add product. Please try again.');
        this.isSaving.set(false);
      },
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
