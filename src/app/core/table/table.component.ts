import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  OnDestroy,
  Output,
  ChangeDetectionStrategy,
  ChangeDetectorRef, ViewChild, ElementRef
} from '@angular/core';
import { IPaginate, ITable } from '@core/table/table';
import {BehaviorSubject, Observable, of, Subject, takeUntil} from 'rxjs';
import { TableFacade } from '@core/table/+state/table.facade';
import {select, Store} from "@ngrx/store";
import {selectSettingsInProgressApi} from "@core/settings/settings.selectors";
import {AppState} from "@core/core.state";
import {distinctUntilChanged, take} from "rxjs/operators";
import {LocalStorageService} from "@core/local-storage/local-storage.service";
import { Paginator } from 'primeng/paginator';
import {ActivatedRoute, Router} from "@angular/router";
import {Table} from "primeng/table";
import * as moment from "jalali-moment";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'data-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, OnDestroy {

  @ViewChild('paginator') paginator: Paginator;
  @ViewChild('dt') dt: Table;

  @Input() dataTable$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  @Input() settingTable$: BehaviorSubject<ITable>;
  @Input() selection$: BehaviorSubject<any[]>;
  @Input() resetPagination$: Subject<any> = new Subject<any>();
  @Input() resetFilterGlobal$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  @Output() selectedRows: EventEmitter<object[]> = new EventEmitter<object[]>();
  @Output() onSelectedAllRows: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() filters: EventEmitter<object[]> = new EventEmitter<object[]>();
  @Output() pagination: EventEmitter<object> = new EventEmitter<object>();

  rowHoverIndex = -1;
  countFirstRow = 1;
  limit = 10;
  destroy$ = new Subject();
  inProgressApis$ = this._store.pipe(select(selectSettingsInProgressApi));
  loading$ = new BehaviorSubject(true);
  selection = [];
  filter = null
  tableColumns$ = new BehaviorSubject([])
  language = this._localStorage.getItem('SETTINGS')?.language||'en'
  showFilter$ = new BehaviorSubject(false)
  toggleFilter$= new BehaviorSubject(0)
  tableName = null
  filterGlobal = null

  constructor(
    private _tableFacade: TableFacade,
    private _store: Store<AppState>,
    private _localStorage: LocalStorageService,
    private _router: Router,
    private _route: ActivatedRoute
  ) { }

  get colSpanEmptyTAble(): number {
    return this.settingTable$.value.columns.filter(column => !column.is_hidden).length +  (this.settingTable$.value?.setting?.selection ? 2 : 1)
  }

  ngOnInit(): void {
    this._route.queryParams.pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged()
    ).subscribe(q => {
      if (q?.page && q?.limit) {
        if (this._localStorage.getItem('active-table-pagination')?.tableName == this.settingTable$.value.setting.tableName)
        this.countFirstRow = ((parseInt(q?.page)-1)*parseInt(q?.limit))+1
        this.limit = parseInt(q?.limit);
      }
    })
    this.resetPagination$.pipe(takeUntil(this.destroy$)).subscribe(_ => {
      this.resetPaginator()
    })
    this.resetFilterGlobal$.pipe(takeUntil(this.destroy$)).subscribe( text => {
      this.filterGlobal = text
    })
    this.selection$?.pipe(takeUntil(this.destroy$)).subscribe(rows => {
      this.selectRows(rows);
    })
    this.inProgressApis$.pipe(takeUntil(this.destroy$)).subscribe(keys => {
      this.settingTable$.pipe(take(1)).subscribe(setting => {
        if (keys?.includes(setting?.setting?.tableName)) {
          this.loading$.next(true)
          this.dataTable$.next(Array(10).fill(0))
          this._tableFacade.setData(setting?.setting?.tableName, 0)
        } else {
          this.loading$.next(false)
        }
      })
    })
    this.toggleFilter$.next(this.settingTable$.value?.columns?.filter(column => !!column?.filter?.key)?.length)
    this.saveColumns()
  }

  paginate(event: IPaginate) {
    const tableName = this.settingTable$.value?.setting?.tableName
    this._tableFacade.changePagination(event, tableName);
    this.countFirstRow = event.first+1;
    this.limit = event.rows;
    this._localStorage.setItem('active-table-pagination', {
      tableName,
      ...event,
      page: event?.page+1
    })
    this._router.navigate([], {queryParams: {page: event?.page+1, limit: event?.rows}, relativeTo: this._route, queryParamsHandling: 'merge'}).then(() => {
      this.pagination.emit(event)
    })
  }

  resetPaginator() {
    if (!this.paginator) return
    this.paginator.first = 0
    this.paginate({
      rows: 10,
      first: 0,
      page: 0,
      pageCount: 10
    })
  }

  rowIsHover(Index: number) {
    this.rowHoverIndex = Index;
  }

  clickRow(button, column, data) {
    this.settingTable$.pipe(take(1)).subscribe(setting => {
      setting?.setting.onClick(button, column, data)
    })
  }

  totalRecord(tblName: string) {
    return this._tableFacade.totalRecords(tblName)
  }

  getPagination(tblName: string) {
    return this._tableFacade.getPagination(tblName)
  }

  onSelectionChange(e) {
    this.selectedRows.emit(e||[])
  }

  onSelectedAll({checked}) {
    this.onSelectedAllRows.emit(checked)
  }

  onFilters(e) {
    e.filters = {...e.filters, q: e.filters?.['global']||''}
    delete e.filters?.global;
    let filters = [...Object.entries(e?.filters)].reduce((obj, [key, value]) => (obj[key] = value['value']?.toString()?.trim(), obj), {});
    Object.keys(filters).forEach(f => {
      if (f.includes('start')||f.includes('end')) {
        filters[f] = moment(filters[f]).unix()
      }
    })
    if (e?.sortField) {
      filters = {
        ...filters,
        sort: e?.sortOrder === 1 ?  e.sortField : `-${ e.sortField}`,
        all: true
      }
    }
    this.filter = {...e, filters: filters, sort: {type: e?.sortOrder, field: e?.sortField}}
    this.filters.emit(this.filter);
  }

  onRowReorder(fromIndex, toIndex) {
    this.dataTable$.pipe(take(1)).subscribe(data => {
      const item = data[fromIndex]
      data.splice(fromIndex, 1)
      data.splice(toIndex, 0, item)
      this.dataTable$.next(data)
    })
  }


  colReorderFromIndex = null
  colReorderToIndex = null
  onColReorder() {
    const tblName = this.settingTable$.value.setting.tableName
    let columns = this._localStorage.getItem('table-columns')?.[tblName]||[]
    if (this.colReorderFromIndex===this.colReorderToIndex) return

    columns.splice(this.colReorderToIndex, 0, columns?.splice(this.colReorderFromIndex, 1)?.[0])
    console.log(columns)

    let data = {
      [tblName]: columns
    }
    let tables = {
      ...this._localStorage.getItem('table-columns'),
      ...data
    }
    this._localStorage.setItem('table-columns', tables)
    this.saveColumns()
  }

  selectRows(selectRows: any[]) {
    this.selection = selectRows||[];
    this.selectedRows.emit(selectRows||[])
  }


  saveColumns() {
    const tblName = this.settingTable$.value.setting.tableName
    let savedColumns = this._localStorage.getItem('table-columns')?.[tblName]||[]
    if (savedColumns) {
      let columns = this.settingTable$.value.columns.map(column => {
        const existColumn = savedColumns?.find(c => c?.label == column.label)
        if (existColumn) return {...existColumn}
        return  ({is_hidden:!!column.is_hidden, label: column.label})
      })

      let tempColumns = savedColumns.map(y => y.label)
      columns = columns?.sort((item1, item2) => tempColumns.indexOf(item1.label) - tempColumns.indexOf(item2.label))

      columns?.forEach(column => {
        this.toggleColumn(column?.label, column.is_hidden)
      })

      this.tableColumns$.next(columns)
      this._localStorage.setItem('table-columns', {
        ...this._localStorage.getItem('table-columns'),
        [tblName]: columns
      })

      // sort by saved columns in local storage
      columns = columns.map(y => y.label)
      this.settingTable$.next({
        ...this.settingTable$.value,
        columns: this.settingTable$.value.columns?.sort((item1, item2) => columns.indexOf(item1.label) - columns.indexOf(item2.label))
      })
      return
    }
    let data = {
      [tblName]: this.settingTable$.value.columns.map((column) => ({is_hidden:!!column.is_hidden, label: column.label}))
    }
    let tables = {
      ...this._localStorage.getItem('table-columns'),
      ...data
    }
    this._localStorage.setItem('table-columns', tables)
    this.tableColumns$.next(data[tblName])
  }

  toggleColumn(columnName: string, value: boolean) {
    const tblName = this.settingTable$.value.setting.tableName
    let columns = this._localStorage.getItem('table-columns')?.[tblName]
    if (!columns) return
    columns = columns?.map(column => {
      if (column?.label == columnName) {
        return {...column, is_hidden: value}
      }
      return column
    })
    let tables = {
      ...this._localStorage.getItem('table-columns'),
      [tblName]: columns
    }
    this._localStorage.setItem('table-columns', tables)
    this.tableColumns$.next(columns)
    const filteredHiddenColumns = (columns||[]).filter(column => column?.is_hidden)?.map(column => column?.label)||[]
    this.settingTable$.next({
      ...this.settingTable$.value,
      columns: this.settingTable$.value.columns.map(column => ({...column, is_hidden: filteredHiddenColumns?.includes(column.label)}))
    })
  }

  ngOnDestroy(): void {
    this.settingTable$.pipe(take(1)).subscribe(setting => {
      this._tableFacade.resetTable(setting.setting.tableName)
    })
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
