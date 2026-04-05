import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-add-product',
  templateUrl: './product-add.html',
  styleUrl: './product-add.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddProduct {}
