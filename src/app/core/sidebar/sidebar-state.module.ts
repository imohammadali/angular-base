import { NgModule } from '@angular/core';
import { SidebarFacade } from '@core/sidebar/+state/sidebar.facade';
import { Store, StoreModule } from '@ngrx/store';
import { SIDEBAR_FEATURE_KEY } from '@core/sidebar/+state/sidebar.entity';
import { SidebarReducers } from '@core/sidebar/+state/sidebar.reducers';



@NgModule({
  imports: [
    StoreModule.forFeature(SIDEBAR_FEATURE_KEY, SidebarReducers.reducer),
  ],
  providers: [SidebarFacade]
})
export class SidebarStateModule { }
