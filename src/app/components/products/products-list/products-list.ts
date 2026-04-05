import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.html',
  styleUrl: './products-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsList {}
