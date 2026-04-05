import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SideBar } from '../side-bar/side-bar';
import { NavBar } from '../nav-bar/nav-bar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, SideBar, NavBar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('IMS_Ephoria');
}

