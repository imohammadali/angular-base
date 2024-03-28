import {Component, OnInit,  Input, ChangeDetectionStrategy} from '@angular/core';
import {IColumn, ITableSetting} from "@core/table/table";
import {BehaviorSubject} from "rxjs";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'column-renderer',
  templateUrl: './column-renderer.component.html',
  styleUrls: ['./column-renderer.component.scss'],
})
export class ColumnRendererComponent implements OnInit {

  @Input() index: number;
  @Input() data: any;
  @Input() column: IColumn;
  @Input() setting: ITableSetting;
  @Input() hoverIndex: number;
  @Input() loading$ = new BehaviorSubject<boolean>(false);

  constructor() { }

  ngOnInit(): void {
  }

}
