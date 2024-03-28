import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {IColumn} from "@core/table/table";
import * as moment from 'jalali-moment';
import {select, Store} from "@ngrx/store";
import {AppState} from "@core/core.state";
import {selectSettingsLanguage} from "@core/settings/settings.selectors";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'date-renderer',
  template: `
    <span>{{ transform(data[col.field], language$ | async) }}</span>
  `,
})
export class DateRenderer {
  @Input() data: any;
  @Input() col: IColumn;
  language$ = this.store.pipe(select(selectSettingsLanguage));

  constructor(
    private store: Store<AppState>) {
  }

  transform(value: any, lang: string) {
    let MomentDate = moment(value, 'YYYY-MM-DDThh:mm:ss.SSZ');
    if (lang === 'fa') {
      return MomentDate.locale('fa').format('HH:mm:ss - jYYYY/jMM/jDD');
    }
    return MomentDate.locale('fa').format('jYYYY/jMM/jDD - HH:mm:ss');
  }
}
