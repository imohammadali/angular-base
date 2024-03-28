import {Component, OnInit,  OnDestroy, ChangeDetectionStrategy} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {selectEffectiveTheme, selectSettingsLanguage} from "@core/settings/settings.selectors";
import {AppState} from "@core/core.state";
import {Observable, Subject} from "rxjs";
import {
  actionSettingsChangeDirection,
  actionSettingsChangeLanguage,
  actionSettingsChangeTheme
} from "@core/settings/settings.actions";
import {environment} from "@env/environment";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'auth-template',
  templateUrl: './auth-template.component.html',
  styleUrls: ['./auth-template.component.scss'],
})
export class AuthTemplateComponent implements OnInit, OnDestroy {

  $destroy = new Subject();
  language$ = this.store.pipe(select(selectSettingsLanguage));
  optionsLang = [{label: 'فا',value: 'fa'}, {label: 'EN',value: 'en'}]
  theme$: Observable<string> = this.store.pipe(select(selectEffectiveTheme))
  assetsUrl = environment.assetURL

  constructor(
    private store: Store<AppState>,
  ) { }

  ngOnInit(): void {
  }

  changeLang(lang) {
    this.store.dispatch(actionSettingsChangeLanguage({language: lang}))
    this.store.dispatch(actionSettingsChangeDirection({rtl: lang == 'fa'}))
  }

  changeTheme(theme: string) {
    theme=='dark-theme' ? theme='default-theme': theme='dark-theme';
    this.store.dispatch(actionSettingsChangeTheme({theme: theme}));
    console.info(`change theme to ${theme}`)
  }

  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.unsubscribe();
  }

}
