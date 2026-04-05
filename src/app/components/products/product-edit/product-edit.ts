import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-product',
  templateUrl: './product-edit.html',
  styleUrl: './product-edit.css',
})
export class EditProduct {
  private readonly route = inject(ActivatedRoute);

  readonly id = signal(this.route.snapshot.paramMap.get('id'));
}
