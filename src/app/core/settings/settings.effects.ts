import { ActivationEnd, Router } from '@angular/router';
import { Injectable, NgZone , ChangeDetectionStrategy} from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { select, Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import {combineLatest, merge, mergeMap, of} from 'rxjs';
import {
  tap,
  withLatestFrom,
  distinctUntilChanged,
  filter, map
} from 'rxjs/operators';

import { selectSettingsState } from '../core.state';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { AnimationsService } from '../animations/animations.service';
import { TitleService } from '../title/title.service';

import {
  actionSettingsChangeAnimationsElements,
  actionSettingsChangeAnimationsPage,
  actionSettingsChangeAnimationsPageDisabled,
  actionSettingsChangeAutoNightMode,
  actionSettingsChangeLanguage,
  actionSettingsChangeTheme,
  actionSettingsChangeStickyHeader,
  actionSettingsChangeHour,
  actionSettingsChangeSidebar,
  actionSettingsChangeDirection,
  actionSettingsChangeMobileSidebar,
  actionSettingsLoading,
  actionSettingsGenerateCaptcha,
  actionSettingsGeneratedCaptcha,
  actionSettingsAddInProgressApi,
  actionSettingsRemoveInProgressApi, actionSettingsSetNotifications,
} from './settings.actions';
import {
  selectEffectiveTheme,
  selectSettingsLanguage,
  selectPageAnimations,
  selectElementsAnimations, selectCaptcha
} from './settings.selectors';
import { State } from './settings.model';
import { BreadcrumbFacade } from '@core/breadcrumb/+state/breadcrumb.facade';
import {ApiService} from "@shared/services/api.service";

export const SETTINGS_KEY = 'SETTINGS';

const INIT = of('test-init-effect-trigger');

@Injectable()
export class SettingsEffects {
  hour = 0;

  changeHour = this.ngZone.runOutsideAngular(() =>
    setInterval(() => {
      const hour = new Date().getHours();
      if (hour !== this.hour) {
        this.hour = hour;
        this.ngZone.run(() =>
          this.store.dispatch(actionSettingsChangeHour({ hour }))
        );
      }
    }, 60_000)
  );

  persistSettings = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          actionSettingsChangeAnimationsElements,
          actionSettingsChangeAnimationsPage,
          actionSettingsChangeAnimationsPageDisabled,
          actionSettingsChangeAutoNightMode,
          actionSettingsChangeLanguage,
          actionSettingsChangeStickyHeader,
          actionSettingsChangeTheme,
          actionSettingsChangeSidebar,
          actionSettingsChangeMobileSidebar,
          actionSettingsChangeDirection,
          actionSettingsLoading,
          actionSettingsAddInProgressApi,
          actionSettingsRemoveInProgressApi,
          actionSettingsSetNotifications,
        ),
        withLatestFrom(this.store.pipe(select(selectSettingsState))),
        tap(([action, settings]) =>
          this.localStorageService.setItem(SETTINGS_KEY, settings)
        )
      ),
    { dispatch: false }
  );

  updateRouteAnimationType = createEffect(
    () =>
      merge(
        INIT,
        this.actions$.pipe(
          ofType(
            actionSettingsChangeAnimationsElements,
            actionSettingsChangeAnimationsPage
          )
        )
      ).pipe(
        withLatestFrom(
          combineLatest([
            this.store.pipe(select(selectPageAnimations)),
            this.store.pipe(select(selectElementsAnimations))
          ])
        ),
        tap(([action, [pageAnimations, elementsAnimations]]) =>
          this.animationsService.updateRouteAnimationType(
            pageAnimations,
            elementsAnimations
          )
        )
      ),
    { dispatch: false }
  );

  updateTheme = createEffect(
    () =>
      merge(INIT, this.actions$.pipe(ofType(actionSettingsChangeTheme))).pipe(
        withLatestFrom(this.store.pipe(select(selectEffectiveTheme))),
        tap(([action, effectiveTheme]) => {
          const classList =
            this.overlayContainer.getContainerElement().classList;
          const toRemove = Array.from(classList).filter((item: string) =>
            item.includes('-theme')
          );
          if (toRemove.length) {
            classList.remove(...toRemove);
          }
          classList.add(effectiveTheme);
        })
      ),
    { dispatch: false }
  );

  setTranslateServiceLanguage = createEffect(
    () =>
      this.store.pipe(
        select(selectSettingsLanguage),
        distinctUntilChanged(),
        tap((language) => {
          this.translateService.use(language);
        })
      ),
    { dispatch: false }
  );

  setTitle = createEffect(
    () =>
      merge(
        this.actions$.pipe(ofType(actionSettingsChangeLanguage)),
        this.router.events.pipe(
          filter((event) => event instanceof ActivationEnd)
        )
      ).pipe(
        tap(() => {
          this.titleService.setTitle(
            this.router.routerState.snapshot.root,
            this.translateService
          );
        })
      ),
    { dispatch: false }
  );

  generateCaptcha = createEffect(
    () =>
      this.actions$.pipe(
        ofType(actionSettingsGenerateCaptcha),
        mergeMap(({size}) =>
          this._api.set('captcha', "GET", {params: {
              w: size.w,
              h: size.h
            }}, res => {}).pipe(
            map((data) =>
              actionSettingsGeneratedCaptcha({data})
            )
          )
        )
      )
  );

  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private router: Router,
    private _api: ApiService,
    private overlayContainer: OverlayContainer,
    private localStorageService: LocalStorageService,
    private titleService: TitleService,
    private animationsService: AnimationsService,
    private translateService: TranslateService,
    private breadcrumbFacade: BreadcrumbFacade,
    private ngZone: NgZone
  ) {}
}
