import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SearchService } from '../search.service';
import { IFramework } from '../shared/interfaces';
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
  @ViewChild('searchLabel') searchLabel!: ElementRef<HTMLLabelElement>;
  searchValue: string = '';
  isAnimationEnd: boolean = false;
  searchTerm: string = '';
  frameworks: IFramework[] = [];

  constructor(private searchService: SearchService) { }
  ngOnInit(): void {
    this.searchService
     .getFrameworks()
      .subscribe((data: IFramework[]) => this.frameworks = data);
   }
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
    
    this.searchTerm = this.searchInput.nativeElement.value;

    if (this.searchTerm.length === 0) {
      this.searchLabel.nativeElement.textContent = '';
    }

    // enter
    if (event.key === 'Enter') {
      this.toggleEvent.emit(true);
    }

    // spacebar
    else if (event.keyCode === 32) {
      this.toggleEvent.emit(true);
    } 
    
    else if (event.key === 'Backspace') {
      if (this.searchTerm && this.searchTerm.length > 0) {
      }

      if(this.searchTerm && this.searchTerm.length === 0){
        this.searchLabel.nativeElement.style.visibility = 'hidden';
        this.searchLabel.nativeElement.textContent = '';
      }
    }

    // emit true only between a-z & enter & spacebar
    else if (
      (event.keyCode >= 65 && event.keyCode <= 90) ||
      (event.keyCode >= 188 && event.keyCode <= 221)
    ) {
      
      // search value, return if match any
      const searchResult = this.frameworks.find(item => item.name[0] === this.searchTerm[0] && item.name.includes(this.searchTerm));
      if (searchResult) {
        this.searchLabel.nativeElement.textContent = searchResult.name;
      }

      this.toggleEvent.emit(true);
    } else if (event.key === 'Escape') {
      this.toggleEvent.emit(false);
    }
  }

  // remove input value after animation
  onAnimationEnd() {
    this.searchValue = '';
    this.searchLabel.nativeElement.textContent = '';
    this.isAnimationEnd = true;
  }
  
  // set animation state
  onAnimationStart() {
    this.isAnimationEnd = false;
  }
}
