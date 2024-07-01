import {Component, OnInit, ChangeDetectionStrategy, Renderer2} from '@angular/core';
import {Observable} from "rxjs";
import {select, Store} from "@ngrx/store";
import {AppState} from "@core/core.state";
import {LocalStorageService} from "@core/local-storage/local-storage.service";
import {PrimeNGConfig} from "primeng/api";
import {NavigationEnd, Router, RouterEvent} from "@angular/router";
import {BreadcrumbFacade} from "@core/breadcrumb/+state/breadcrumb.facade";
import {
  routeAnimations,
  selectEffectiveTheme,
  selectIsAuthenticated,
  selectSettingsLanguage,
  selectSettingsStickyHeader
} from "@core/core.module";
import {selectRtlDirection} from "@core/settings/settings.selectors";
import {SidebarFacade} from "@core/sidebar/+state/sidebar.facade";
import {TranslateService} from "@ngx-translate/core";
import {distinctUntilChanged, take} from "rxjs/operators";
import {environment} from "@env/environment";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // tslint:disable-next-line:component-selector
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeAnimations]
})
export class AppComponent implements OnInit {

  isAuthenticated$: Observable<boolean> | undefined;
  stickyHeader$: Observable<boolean> | undefined;
  language$: Observable<string> | undefined;
  theme$: Observable<string> | undefined;
  rtl$: Observable<boolean> | undefined;
  assetURL = environment.assetURL

  constructor(
    private store: Store<AppState>,
    private storageService: LocalStorageService,
    private primengConfig: PrimeNGConfig,
    private router: Router,
    private breadcrumbFacade: BreadcrumbFacade,
    private sidebarFacade: SidebarFacade,
    private _translate: TranslateService,
    public renderer : Renderer2
  ) {
  }

  ngOnInit() {
    this.storageService.testLocalStorage();

    this.primengConfig.ripple = true;

    this.isAuthenticated$ = this.store.pipe(select(selectIsAuthenticated));
    this.stickyHeader$ = this.store.pipe(select(selectSettingsStickyHeader));
    this.language$ = this.store.pipe(select(selectSettingsLanguage));
    this.theme$ = this.store.pipe(select(selectEffectiveTheme));
    this.rtl$ = this.store.pipe(select(selectRtlDirection));

    this.language$.subscribe((lang: string) => {

      // translate primeng element labels
      let labels = ['feedback.no_result_found'];
      this._translate.get(labels).pipe(take(1)).subscribe(translatedLabels => {
        this.primengConfig.setTranslation({
          emptyFilterMessage: translatedLabels['feedback.no_result_found'] || 'unknown label',
          emptyMessage: translatedLabels['feedback.no_result_found'] || 'unknown label',
        })
      })

      this.breadcrumbFacade.touchData();
      this.sidebarFacade.touchData();

    })

    this.theme$.pipe(distinctUntilChanged()).subscribe(theme => {
      switch (theme) {
        case 'default-theme': {
          this.renderer.removeClass(document.body, 'dark-theme')
          this.renderer.addClass(document.body, 'default-theme')
          break
        }
        case 'dark-theme': {
          this.renderer.addClass(document.body, 'dark-theme')
          this.renderer.removeClass(document.body, 'default-theme')
          break
        }
      }
    })

    this.rtl$.pipe(distinctUntilChanged()).subscribe(rtl => {
      if (rtl) {
        this.renderer.addClass(document.body, 'rtl-theme')
        this.renderer.removeClass(document.body, 'ltr-theme')
      } else {
        this.renderer.removeClass(document.body, 'rtl-theme')
        this.renderer.addClass(document.body, 'ltr-theme')
      }
    })
  }
}
