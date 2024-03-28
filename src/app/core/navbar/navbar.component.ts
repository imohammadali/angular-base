import {Component, OnInit,  OnDestroy, ChangeDetectionStrategy} from '@angular/core';
import { environment } from '@env/environment';
import { select, Store } from '@ngrx/store';
import { AppState } from '../core.state';
import {
  selectEffectiveTheme,
  selectMobileSidebar,
  selectSettingsLanguage, selectSettingsLoading, selectSettingsNotification,
  selectSidebar
} from '../settings/settings.selectors';
import {
  actionSettingsChangeLanguage,
  actionSettingsChangeTheme,
  actionSettingsChangeSidebar,
  actionSettingsChangeDirection, actionSettingsChangeMobileSidebar, actionSettingsSetNotifications
} from '../settings/settings.actions';
import {interval, Observable, Subject, takeUntil} from 'rxjs';
import {Router} from "@angular/router";
import {LocalStorageService} from "@core/local-storage/local-storage.service";
import {ApiService} from "@shared/services/api.service";
import {DialogService} from "@shared/services/dialog.service";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: [],
})
export class NavbarComponent implements OnInit, OnDestroy {

  theme$: Observable<string> = this.store.pipe(select(selectEffectiveTheme))
  show_sidebar$: Observable<boolean> = this.store.pipe(select(selectSidebar))
  show_mobile_sidebar$: Observable<boolean> = this.store.pipe(select(selectMobileSidebar))
  language$: Observable<string> = this.store.pipe(select(selectSettingsLanguage))
  notifications$: Observable<any[]> = this.store.pipe(select(selectSettingsNotification))
  show_loading$: Observable<boolean> = this.store.pipe(select(selectSettingsLoading));
  assetURL = environment.assetURL
  destroy$ = new Subject()
  optionsLang = [{label: 'فا',value: 'fa'}, {label: 'EN',value: 'en'}]

  constructor(
    private store: Store<AppState>,
    private _router: Router,
    private _localStorage: LocalStorageService,
    private _api: ApiService,
    private _dialogService: DialogService
  ) {
    interval(60000).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.getUnreadNotifications()
    })
  }

  get username(): string {
    return this._localStorage.getItem('user')?.user?.username||''
  }

  ngOnInit(): void {
    this.getUnreadNotifications()
  }

  changeTheme(theme: string) {
    theme=='dark-theme' ? theme='default-theme': theme='dark-theme';
    this.store.dispatch(actionSettingsChangeTheme({theme: theme}));
    console.info(`change theme to ${theme}`)
  }

  toggle_sidebar(action: string) {
    let show = action != 'true';
    this.store.dispatch(actionSettingsChangeSidebar({show_sidebar: show}));
  }


  getUnreadNotifications() {
    const token = this._localStorage.getItem("user")?.token;
    const username = this._localStorage.getItem('user')?.user?.username;
    if (!token || !username) return;
    const model = {
      receiver: username,
      limit: 100,
      Page: 1,
    }
    this._api.set(
      `notify/getUnread`,
      "POST",
      {
        body: model
      },
      (res: any): void => {
        this.setNotifications(res?.notifications||[])
      }
    )
  }

  setNotifications(items) {
    this.store.dispatch(actionSettingsSetNotifications({notifications: items}));
  }

  toggle_mobile_sidebar(action: string) {
    let show = action != 'true';
    this.store.dispatch(actionSettingsChangeMobileSidebar({show_mobile_sidebar: show}));
  }

  changeLanguage(language: string) {
    switch (language) {
      case 'en': {
        this.store.dispatch(actionSettingsChangeLanguage({language: 'en'}));
        this.store.dispatch(actionSettingsChangeDirection({rtl: false}));
        break;
      }
      case 'fa': {
        this.store.dispatch(actionSettingsChangeLanguage({language: 'fa'}));
        this.store.dispatch(actionSettingsChangeDirection({rtl: true}));
        break;
      }
      default: {
        this.store.dispatch(actionSettingsChangeLanguage({language: 'en'}));
        this.store.dispatch(actionSettingsChangeDirection({rtl: false}));
      }
    }
  }

  setNotificationToRead(ids, message) {
    this._api.set('notify/setToRead', "POST", {
      body: {
        id: ids,
        receivers: []
      }
    }, () => {
      this._dialogService.confirm({
        message: message,
        rejectLabel: 'forms.submit',
        acceptVisible: false,
        rejectIcon: 'pi pi-check',
        rejectButtonStyleClass: 'btn btn-primary',
        reject: () => {},
      })
      this.getUnreadNotifications()
    })
  }

  setAllNotificationsToRead() {
    let idsNotifications = []
    this.notifications$.pipe(takeUntil(this.destroy$)).subscribe(notifications => {
      idsNotifications = notifications?.map(notification => notification?.id).filter(notification => !!notification)||[]
    })
    this._dialogService.confirm({
      message: 'feedback.are_you_sure',
      acceptLabel: 'feedback.yes',
      rejectLabel: 'feedback.no',
      reject: () => {},
      accept: () => {
        this._api.set('notify/setToRead', "POST", {
          body: {
            id: idsNotifications,
            receivers: []
          }
        }, () => {
          this.getUnreadNotifications()
        })
      }
    })
  }

  logOut() {
    this._localStorage.removeItem('user');
    this._router.navigate(['auth/sign-in']);
  }

  ngOnDestroy() {
    this.destroy$.next(true)
    this.destroy$.unsubscribe()
  }

}
