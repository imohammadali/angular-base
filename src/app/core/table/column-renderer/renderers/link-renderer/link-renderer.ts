import { Component, EventEmitter, Input, OnInit, Output , ChangeDetectionStrategy} from '@angular/core';
import {IColumn, ITableSetting} from "@core/table/table";
import {Router} from "@angular/router";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'link-renderer',
  template: `
    <span (click)="clicked(col, data)">{{data[col.field]}}</span>
  `,
  styles: [`
    span {
      text-decoration: underline;
      color: var(--main-info-color);
    }
  `]
})
export class LinkRenderer {
  @Input() data: any;
  @Input() col: IColumn;
  @Input() setting: ITableSetting;

  constructor(private _router: Router) {}

  clicked(col, data) {
    if (col.renderer_option?.linkField && data[col.renderer_option?.linkField]) {
      switch (col.renderer_option?.target) {
        case 'blank': {
          const url = location.origin + '/admin' + String(this._router.createUrlTree([data[col.renderer_option?.linkField]]));
          window.open(url, '_blank');
          break
        }
        default:
        case 'self': {
          this._router.navigate([data[col.renderer_option?.linkField]])
          break
        }
      }
    }
  }
}
