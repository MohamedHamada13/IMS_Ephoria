import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css',
  host: {
    class: 'col-12 col-md-3 col-lg-2 bg-light border-end py-3 d-block',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideBar {}
