import { Component } from '@angular/core';
import { isBoolean, isNil } from 'lodash'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isHidden: boolean = true;

  // set hidden value
  toggleSearch(hidden?: boolean | MouseEvent) {

    if (!isNil(hidden) && isBoolean(hidden)) {
      this.isHidden = hidden;
    }

    else if(isNil(hidden)) {
      this.isHidden = !this.isHidden;
    }
  }
}
