import { Component, Input, OnInit , ChangeDetectionStrategy} from '@angular/core';
import {IActionButton, IColumn, ITableSetting} from "@core/table/table";
import {BehaviorSubject} from "rxjs";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'action-button-renderer',
  template: `
    <div class="action-button">
      <ng-container *ngFor="let item of actionButton$|async">
          <span (click)="clicked(item, col, data)" *ngIf="!item?.is_hidden">
            <i [class]="rewriteIcon(item.button)" [class.disabled]="item?.disabled"></i>
          </span>
      </ng-container>
    </div>
  `,
  styleUrls: ['./action-button.scss']
})
export class ActionButton implements OnInit {
  @Input() data: any;
  @Input() col: IColumn;
  @Input() setting: ITableSetting;
  @Input() index: number;

  actionButton$ = new BehaviorSubject<IActionButton[]>([])

  constructor() { }

  ngOnInit() {
    let action_buttons = this.setting?.actionButton?.map(button => {
      if(!this.setting?.actionButtonMap) return button
      return {
        ...button,
        disabled: this.setting?.actionButtonMap(button, this.data)?.disabled||false,
        is_hidden: this.setting?.actionButtonMap(button, this.data)?.is_hidden||false
      }
    })
    this.actionButton$.next(action_buttons||[])
  }

  clicked(item, col, data) {
    this.setting.onClick(item.button, col, data, this.index );
  }

  rewriteIcon(button): string {
    switch (button) {
      case 'delete': return  'pi pi-trash'
      case 'edit': return  'pi pi-file-edit'
      case 'copy': return  'pi pi-copy'
      case 'password': return  'pi pi-key'
      case 'export': return  'pi pi-file-export'
      default: return ''
    }
  }

}
