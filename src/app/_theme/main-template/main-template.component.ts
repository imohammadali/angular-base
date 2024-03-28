import {Component, OnInit, ChangeDetectionStrategy, Injector, AfterViewInit, OnDestroy} from '@angular/core';
import {Observable, Subject, takeUntil} from 'rxjs';
import { select, Store } from '@ngrx/store';
import {selectMobileSidebar, selectSettingsLoading, selectSidebar} from '@core/settings/settings.selectors';
import { AppState } from '@core/core.state';
import { actionSettingsChangeMobileSidebar } from '@core/settings/settings.actions';
import {Utility} from "@shared/services/utility";
import {NavigationEnd} from "@angular/router";
import {filter} from "rxjs/operators";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'main-template',
  templateUrl: './main-template.component.html',
  styleUrls: ['./main-template.component.scss'],
})
export class MainTemplateComponent extends Utility implements OnDestroy, AfterViewInit {

  show_sidebar$: Observable<boolean> = this.store.pipe(select(selectSidebar));
  show_mobile_sidebar$: Observable<boolean> = this.store.pipe(select(selectMobileSidebar));
  destroy$ = new Subject()

  constructor(
    private store: Store<AppState>,
    injector: Injector
  ) {
    super(injector)
  }

  ngAfterViewInit(): void {
    this.tourInit()
    this.router.events.pipe(filter(x => true))
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.tourInit()
      }
    });
  }

  toggle_mobile_sidebar(action: string) {
    let show = action != 'true';
    this.store.dispatch(actionSettingsChangeMobileSidebar({show_mobile_sidebar: show}));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true)
    this.destroy$.unsubscribe()
  }

}
