import { Component, Input, OnInit , ChangeDetectionStrategy} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'boolean-renderer',
  template: `
    <ng-template [ngIf]="data" [ngIfElse]="uncheck">
      <i [class]="'icon-check-circle-o'" style="color: var(--main-success-color)"></i>
    </ng-template>
    <ng-template #uncheck>
      <i [class]="'icon-times-circle-o'" style="color: var(--main-error-color)"></i>
    </ng-template>
  `,
})
export class BooleanRenderer {
  @Input() data: any;
}
