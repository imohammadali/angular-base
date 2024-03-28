import {Component, Input, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {BehaviorSubject} from "rxjs";


export interface IItemListBox {
  label: string;
  value: string;
  meta?: any|{
    typeValue?: 'badge'|'icon'|'button';
    is_hidden?: boolean;
    classValue?: string;
    styleValue?: string;
    labelParam?: object;
    onClick?: Function;
  };
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'list-box',
  templateUrl: './list-box.component.html'
})
export class ListBoxComponent implements OnInit {

  @Input() data$: BehaviorSubject<IItemListBox[]> = new BehaviorSubject<IItemListBox[]>([]);

  constructor() {
  }

  ngOnInit(): void {
  }


}
