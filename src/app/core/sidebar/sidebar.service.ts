import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
// import { DynamicDashboardService } from 'src/app/shared/services/dynamic-dashboard.service'

@Injectable({
  providedIn: 'root',
})
export class SideBarService {
  myDashboardsView$ = new BehaviorSubject<any[]>([]);

  constructor() // public DynamicDashboardService: DynamicDashboardService,
  {}

  reloadList() {
    // this.DynamicDashboardService.getNonDefaultDashboards().then(data => {
    //   this.myDashboardsView$.next(data);
    // });
  }
}
