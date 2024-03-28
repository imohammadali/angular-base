import { Component, EventEmitter, Input, OnInit, Output , ChangeDetectionStrategy} from '@angular/core';
import {IColumn, ITableSetting} from "@core/table/table";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'toggle-renderer',
  template: `
    <div class="toggle-select d-flex justify-content-center">
      <p-inputSwitch
        [readonly]="true"
        (click)="clicked(setting, col, data)"
        [(ngModel)]="data[col.field]"
      ></p-inputSwitch>
    </div>
  `,
})
export class ToggleRenderer {
  @Input() data: any;
  @Input() col: IColumn;
  @Input() setting: ITableSetting;

  constructor() {}

  clicked(item, col, data) {
    if (item && item.onClick && item.onClick instanceof Function) {
      this.setting?.onClick('toggle', col, data);
    }
  }
}
