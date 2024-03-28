import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {IColumn, ITableSetting} from "@core/table/table";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'icon-renderer',
  template: `
    <i style="cursor: pointer;{{data[col.renderer_option?.iconStyleField]||''}}"
        [pTooltip]="data[col.renderer_option?.tooltip]"
       [class]="data[(col.renderer_option?.iconClassFiled||col?.field)]" (click)="clicked(col.field, col, data)"></i>
  `,
})

export class IconRendererComponent {
  @Input() data: any;
  @Input() col: IColumn;
  @Input() setting: ITableSetting;

  clicked(item, col, data) {
    this.setting.onClick(item, col, data);
  }
}
