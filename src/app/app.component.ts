import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    template: `<router-outlet />`,
    styles: [],
    standalone: false
})
export class AppComponent {
  title = 'ConfigCat Feature Flags';
}
