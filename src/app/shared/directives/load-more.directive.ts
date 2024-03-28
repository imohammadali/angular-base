import {
  Directive,
  ElementRef, EventEmitter, HostListener,
  Input, Output,
} from '@angular/core';

@Directive({
  selector: '[load-more]',
})

export class LoadMoreDirective {

  @Input() element: string = null
  @Output() loadMore = new EventEmitter()

  @HostListener('click', ['$event'])
  onScroll(event) {
    let el: HTMLDivElement = null;
    switch (this.element) {
      case 'treeSelect': {
        el = this._hostElement.nativeElement.getElementsByClassName('p-treeselect-items-wrapper')?.[0]
        break
      }
    }
    el.onscroll = () => {
      if (el.scrollTop + el.clientHeight + 50 > el.scrollHeight) {
        this.loadMore.emit()
      }
    }

  }

  constructor(
    private _hostElement: ElementRef,
  ) {}

}
