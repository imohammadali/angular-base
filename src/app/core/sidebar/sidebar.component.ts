import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Injector } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { environment } from '@env/environment';
import { SidebarFacade } from '@core/sidebar/+state/sidebar.facade';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { Utility } from "@shared/services/utility";
import { FeaturesConstant } from "@core/permission/features.constant";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent extends Utility implements OnInit, OnDestroy {

  items: MenuItem[] = [
    {
      icon: 'icon-dashboard',
      label: 'sidebar.dashboard.~',
      expanded: this.checkActiveState('/dashboard'),
      styleClass: 'has-children',
      visible: this.permissionService.checkUserType().some(type => ['super_user', 'admin'].includes(type)),
      items: [
        {
          label: 'sidebar.dashboard.main_dashboard',
          routerLink: '/dashboard/main',
        },
        {
          label: 'sidebar.dashboard.monitoring_main_dashboard',
          routerLink: '/dashboard/main-ticket',
        },
        {
          label: 'sidebar.dashboard.admin_ticket_monitoring_dashboard',
          routerLink: '/dashboard/admin-ticket',
        },
        {
          label: 'sidebar.dashboard.information_dashboard',
          routerLink: '/dashboard/main-old',
        }
      ]
    },
    {
      icon: 'icon-dashboard',
      label: 'sidebar.dashboard.~',
      routerLink: '/dashboard/main',
      visible: this.permissionService.checkUserType().includes('customer')
    },
    {
      icon: 'icon-user-tie',
      label: 'sidebar.management.~',
      expanded: this.checkActiveState('/management'),
      styleClass: 'has-children',
      visible: this.permissionService.checkUserType().some(type => ['super_user', 'admin'].includes(type)),
      items: [
        {
          label: 'sidebar.management.user_management',
          routerLink: '/management/users',
          visible: this.permissionService.checkAccess({ [FeaturesConstant.user_management]: ['read'] })
        },
        {
          label: 'sidebar.management.customer_management',
          routerLink: '/management/customers',
          visible: this.permissionService.checkAccess({ [FeaturesConstant.customer_management]: ['read'] })
        },
        {
          label: 'sidebar.management.base_information_management',
          routerLink: '/management/info',
          visible: this.permissionService.checkAccess({ [FeaturesConstant.base_info_management]: ['read'] })
        },
        {
          label: 'sidebar.management.kpi_management',
          routerLink: '/management/kpi',
          visible: this.permissionService.checkAccess({ [FeaturesConstant.kpi_management]: ['read'] })
        },
        {
          label: 'sidebar.management.acs_management',
          routerLink: '/management/acs',
          visible: this.permissionService.checkAccess({ [FeaturesConstant.acs_management]: ['read'] })
        },
        {
          label: 'sidebar.management.bulk_operation',
          routerLink: '/management/bulk-operation',
          visible: this.permissionService.checkAccess({ [FeaturesConstant.bulk_operation]: ['read'] })
        },
        {
          label: 'sidebar.management.group_management',
          routerLink: '/management/groups',
          visible: this.permissionService.checkAccess({ [FeaturesConstant.group_management]: ['read'] })
        },
        {
          label: 'sidebar.management.role_management',
          routerLink: '/management/roles',
          visible: this.permissionService.checkAccess({ [FeaturesConstant.role_management]: ['read'] })
        },
        {
          label: 'sidebar.management.apn_management',
          routerLink: '/management/apn',
          visible: this.permissionService.checkAccess({ [FeaturesConstant.apn_management]: ['read'] })
        },
        {
          label: 'sidebar.management.sla_management',
          routerLink: '/management/sla',
          visible: this.permissionService.checkAccess({ [FeaturesConstant.sla_management]: ['read'] })
        },
        {
          label: 'sidebar.management.branch_management',
          routerLink: '/management/nodegroup',
          visible: this.permissionService.checkAccess({ [FeaturesConstant.node_management]: ['read'], [FeaturesConstant.group_management]: ['read'] })
        },
        {
          label: 'sidebar.management.cities_management',
          routerLink: '/management/cities',
          visible: this.permissionService.checkAccess({ [FeaturesConstant.cities_management]: ['read'] })
        },
        {
          label: 'sidebar.management.setting',
          routerLink: '/management/general-setting',
          visible: this.permissionService.checkAccess({ [FeaturesConstant.general_setting]: ['read'] })
        },
        {
          label: 'sidebar.management.notifications_management',
          routerLink: '/management/events',
          visible: this.permissionService.checkAccess({ [FeaturesConstant.notification]: ['read'] })
        },
        {
          label: 'sidebar.management.send_direct_notification',
          routerLink: '/management/direct-notification',
          visible: this.permissionService.checkAccess({ [FeaturesConstant.direct_notif_feature]: ['read'] })
        },
        {
          label: 'sidebar.management.scheduling_notification',
          routerLink: '/management/scheduling-notification',
          visible: this.permissionService.checkAccess({ [FeaturesConstant.notification]: ['read'] })
        },
        {
          label: 'sidebar.management.dashboard-maker',
          routerLink: '/management/dashboard-maker',
          visible: this.permissionService.checkAccess({[FeaturesConstant.dashboardmaker_feature]: ['read']})
        },
        {
          label: 'sidebar.management.tour_management.~',
          expanded: this.checkActiveState('/management/tours'),
          visible: this.permissionService.checkAccess({ [FeaturesConstant.tour_management]: ['read'] }),
          items: [
            {
              label: 'sidebar.management.tour_management.helps',
              routerLink: '/management/tours/list',
            },
            {
              label: 'sidebar.management.tour_management.pages',
              routerLink: '/management/tours/pages',
            },
          ]
        },
        {
          label: 'sidebar.management.vendor',
          routerLink: '/management/vendor',
          // visible: this.permissionService.checkAccess({[FeaturesConstant.notification]: ['read']})
        },{
          label: 'sidebar.management.calendar',
          routerLink: '/management/calendar',
          visible: this.permissionService.checkAccess({ [FeaturesConstant.calendar_management]: ['read'] }),
        },
      ]
    },
    {
      icon: 'icon-wrench',
      label: 'sidebar.tools.~',
      expanded: this.checkActiveState('/tools'),
      styleClass: 'has-children',
      visible: this.permissionService.checkUserType().some(type => ['super_user', 'admin'].includes(type)),
      items: [
        {
          label: 'sidebar.tools.taskResult',
          routerLink: '/tools/taskID',
          visible: this.permissionService.checkAccess({ [FeaturesConstant.task_status]: ['read'] })
        },
        {
          label: 'sidebar.tools.ping',
          routerLink: '/tools/ping',
          visible: this.permissionService.checkAccess({ [FeaturesConstant.diagnostic_ping]: ['read'] })
        },
        {
          label: 'sidebar.tools.traceroute',
          routerLink: '/tools/traceroute',
          visible: this.permissionService.checkAccess({ [FeaturesConstant.diagnostic_traceroute]: ['read'] })
        },
      ]
    },
    {
      icon: 'icon-tree',
      label: 'sidebar.services.~',
      routerLink: '/services',
      visible: this.permissionService.checkAccess({ [FeaturesConstant.node_management]: ['read'], [FeaturesConstant.group_management]: ['read'] })
    },
    {
      icon: 'icon-map-marker',
      label: 'sidebar.monitoring.~',
      routerLink: '/monitoring',
      visible: this.permissionService.checkAccess({ [FeaturesConstant.monitoring_feature]: ['read'] })
    },
    {
      icon: 'icon-chain-broken',
      label: 'sidebar.tickets.~',
      routerLink: '/reports',
      visible: this.permissionService.checkAccess({ [FeaturesConstant.report_feature]: ['read'] })
    },
    {
      icon: 'icon-bar-chart',
      label: 'sidebar.ip_pools.~',
      routerLink: '/ip_pools',
      visible: this.permissionService.checkAccess({ [FeaturesConstant.ip_pool]: ['read'] }) && this.permissionService.checkUserType().some(type => ['customer'].includes(type)),
    },
    {
      icon: 'icon-mail-envelope-open',
      label: 'sidebar.requests.~',
      routerLink: '/requests',
      visible: this.permissionService.checkAccess({ [FeaturesConstant.requesting]: ['read'] })
    },
    {
      icon: 'icon-terminal',
      label: 'sidebar.logs',
      routerLink: '/logs',
      visible: this.permissionService.checkAccess({ [FeaturesConstant.logs]: ['read'] })
    },
    {
      icon: 'icon-file-text',
      label: 'sidebar.dynamicReport',
      routerLink: '/dynamic-report',
      visible: this.permissionService.checkAccess({ [FeaturesConstant.report_feature]: ['read', 'create'] })
    },
    {
      icon: 'icon-envelope',
      label: 'sidebar.notification',
      routerLink: '/notify',
      visible: this.permissionService.checkAccess({ [FeaturesConstant.notification]: ['read'] })
    },
    {
      icon: 'icon-terminal',
      label: 'sidebar.tv-wall',
      routerLink: '/tv-wall',
      visible: this.permissionService.checkAccess({ [FeaturesConstant.tvwall_feature]: ['read'] })
    },
  ];
  assetURL = environment.assetURL;
  sidebarItems$ = this._facade.sidebarItems$;
  destroy$ = new Subject();

  constructor(
    private _facade: SidebarFacade,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._facade.touchState$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this._facade.updateSidebarItems([...this.items]);
    });
  }

  checkActiveState(givenLink: string) {
    return this.router.url.indexOf(givenLink) !== -1;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  showDasboardList: boolean = false;
  ChangeDashboardVisibility(event: Event) {
    event.stopPropagation();
    this.showDasboardList = !this.showDasboardList;
  }

  selectedDashboard: any;
  public routeToDashboard() {
    if (this.selectedDashboard) {
      this.router.navigate([`/dashboard/dynamic-dashboard/${this.selectedDashboard}`])
    }

  }

}
