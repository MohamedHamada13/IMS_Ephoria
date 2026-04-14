import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { SideBar } from '../side-bar/side-bar';
import { NavBar } from '../nav-bar/nav-bar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SideBar, NavBar],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly title = signal('IMS_Ephoria');

  private readonly currentUrl = signal(this.router.url);

  readonly showSideBar = computed(() => {
    const url = this.currentUrl();
    return !(url.startsWith('/login') || url.startsWith('/register'));
  });

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => {
        this.currentUrl.set(event.urlAfterRedirects);
      });
  }
}

