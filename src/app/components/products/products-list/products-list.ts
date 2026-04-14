import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import type { IProduct } from '../../../models/IProduct';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-products-list',
  imports: [RouterLink],
  templateUrl: './products-list.html',
  styleUrl: './products-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ProductsList {
  private readonly productService = inject(ProductService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly pageSize = 5; // Number of products per page [pagination]

  readonly isLoading = signal(true);
  readonly deletingId = signal<number | null>(null);

  readonly products = signal<IProduct[]>([]);
  readonly page = signal(1);
  readonly searchTerm = signal('');

  readonly filteredProducts = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const products = this.products();

    if (!term) return products;

    return products.filter((p) => p.name.toLowerCase().includes(term));
  });

  readonly totalPages = computed(() => {
    const total = Math.ceil(this.filteredProducts().length / this.pageSize);
    return Math.max(1, total);
  });

  readonly pagedProducts = computed(() => {
    const startIndex = (this.page() - 1) * this.pageSize;
    return this.filteredProducts().slice(startIndex, startIndex + this.pageSize);
  });

  constructor() {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);

    const subscription = this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.page.set(1);
        this.isLoading.set(false);
      },
      error: () => {
        this.products.set([]);
        this.page.set(1);
        this.isLoading.set(false);
      },
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  prevPage(): void {
    this.page.update((current) => Math.max(1, current - 1));
  }

  nextPage(): void {
    this.page.update((current) => Math.min(this.totalPages(), current + 1));
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    this.searchTerm.set(input?.value ?? '');
    this.page.set(1);
  }

  deleteProduct(id: number): void {
    if (this.deletingId() !== null) return;

    this.deletingId.set(id);

    const subscription = this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.products.update((products) => products.filter((p) => p.id !== id));

        const maxPage = this.totalPages();
        if (this.page() > maxPage) {
          this.page.set(maxPage);
        }
      },
      error: () => {
        this.deletingId.set(null);
      },
      complete: () => {
        this.deletingId.set(null);
      },
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
