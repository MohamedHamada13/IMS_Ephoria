import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  imports: [],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
  host: {
    class: 'd-block w-100',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavBar {}
