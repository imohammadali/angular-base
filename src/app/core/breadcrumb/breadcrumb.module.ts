import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {StoreModule} from "@ngrx/store";
import {TranslateModule} from "@ngx-translate/core";
import {BREADCRUMB_FUTURE_KEY} from "@core/breadcrumb/+state/breadcrumb.entity";
import {breadCrumbReducers} from "@core/breadcrumb/+state/breadcrumb.reducers";
import {BreadcrumbComponent} from "@core/breadcrumb/breadcrumb.component";
import {BreadcrumbFacade} from "@core/breadcrumb/+state/breadcrumb.facade";
import {BreadcrumbModule as breadcrumb} from 'primeng/breadcrumb';

@NgModule({
  declarations: [
    BreadcrumbComponent
  ],
  imports: [
    CommonModule,
    StoreModule.forFeature(BREADCRUMB_FUTURE_KEY, breadCrumbReducers),
    TranslateModule,
    breadcrumb,
  ],
  exports: [
    BreadcrumbComponent,
    breadcrumb
  ],
  providers: [
    BreadcrumbFacade
  ]
})
export class BreadcrumbModule { }
