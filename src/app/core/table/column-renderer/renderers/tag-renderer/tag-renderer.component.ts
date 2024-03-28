import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {IColumn, ITableSetting} from "@core/table/table";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tag-renderer',
  template: `
    <ng-template [ngIf]="data[col.field]?.length > 0" [ngIfElse]="noData">
      <ng-container *ngFor="let field of [].concat(data[col.field])">
        <p-tag [rounded]="col.renderer_option?.rounded"
               [styleClass]="data[col.renderer_option?.classField]?.()" [value]="field|translate">
        </p-tag>
      </ng-container>
    </ng-template>
    <ng-template #noData>-</ng-template>
  `,
})

export class TagRendererComponent {
  @Input() data: any;
  @Input() col: IColumn;
  @Input() setting: ITableSetting;
}
