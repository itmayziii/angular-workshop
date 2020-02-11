import { Component, Input } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-sidebar',
  template: `
    <aside>
      <nav>
        {{user?.displayName}}
        Sidebar
      </nav>
    </aside>
  `,
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() user: firebase.User | null;
}
