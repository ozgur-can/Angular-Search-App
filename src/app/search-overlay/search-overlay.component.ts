import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-search-overlay',
  animations: [
    trigger('hideShow', [
      state('hidden', style({
        opacity: 0,
        transform: 'translateY(-25%) rotateX(60deg)'
      })),
      state('visible', style({
        opacity: .85,
        transform: 'rotateX(0deg)'
      })),
      transition('hidden => visible', [
        animate('0.25s')
      ]),
      transition('visible => hidden', [
        animate('0.25s')
      ])
    ])
  ],
  templateUrl: './search-overlay.component.html',
  styleUrls: ['./search-overlay.component.scss']
})
export class SearchOverlayComponent implements OnInit {
  @Input() isHidden: boolean = true;
  @Output() toggleEvent = new EventEmitter<boolean | MouseEvent>();
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  searchValue: string = '';
  isAnimationEnd: boolean = false;

  constructor() { }
  ngOnInit(): void { }
  ngOnChanges() {
    // focus input when button is (in app component) clicked
    if (this.searchInput && this.searchInput.nativeElement !== document.activeElement) {
      this.searchInput.nativeElement.focus();
    }
  }

  // emit false to parent
  hideSearch() {
    this.toggleEvent.emit(false);
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {

    if (!event || !this.isAnimationEnd) {
      return;
    }

    // emit true only between a-z & enter & spacebar
    if (
      (event.keyCode >= 65 && event.keyCode <= 90) ||
      (event.keyCode >= 188 && event.keyCode <= 221) ||
      event.key === 'Enter' ||
      event.keyCode === 32 // spacebar
    ) {
      this.toggleEvent.emit(true);
    } else if (event.key === 'Escape') {
      this.toggleEvent.emit(false);
    }
  }

  // remove input value after animation
  onAnimationEnd() {
    this.searchValue = '';
    this.isAnimationEnd = true;
  }
  
  // set animation state
  onAnimationStart() {
    this.isAnimationEnd = false;
  }
}
