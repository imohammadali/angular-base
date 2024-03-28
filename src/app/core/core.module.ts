import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import {
  HttpClientModule,
  HttpClient,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import {
  StoreRouterConnectingModule,
  RouterStateSerializer
} from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormsModule } from '@angular/forms';

import { environment } from '@env/environment';

import {
  AppState,
  reducers,
  metaReducers,
  selectRouterState
} from './core.state';
import { AuthEffects } from './auth/auth.effects';
import { selectIsAuthenticated, selectAuth } from './auth/auth.selectors';
import { authLogin, authLogout } from './auth/auth.actions';
import { AuthGuardService } from './auth/auth-guard.service';
import { TitleService } from './title/title.service';
import {
  ROUTE_ANIMATIONS_ELEMENTS,
  routeAnimations
} from './animations/route.animations';
import { AnimationsService } from './animations/animations.service';
import { CustomSerializer } from './router/custom-serializer';
import { LocalStorageService } from './local-storage/local-storage.service';
import { HttpErrorInterceptor } from './http-interceptors/http-error.interceptor';
import { SettingsEffects } from './settings/settings.effects';
import {
  selectSettingsLanguage,
  selectEffectiveTheme,
  selectSettingsStickyHeader
} from './settings/settings.selectors';
import { SidebarComponent } from './sidebar/sidebar.component';
import { PanelMenuModule } from 'primeng/panelmenu';
import { NavbarComponent } from './navbar/navbar.component';
import { SharedModule } from '@shared/shared.module';
import { BreadcrumbModule } from '@core/breadcrumb/breadcrumb.module';
import { TableModule } from '@core/table/table.module';
import { SidebarStateModule } from '@core/sidebar/sidebar-state.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MainTemplateComponent } from '../_theme/main-template/main-template.component';
import {AuthTemplateComponent} from "../_theme/auth-template/auth-template.component";
import {HttpBaseInterceptor} from "@core/http-interceptors/http.interceptor";
import {ApiService} from "@shared/services/api.service";

export {
  TitleService,
  selectAuth,
  authLogin,
  authLogout,
  routeAnimations,
  AppState,
  LocalStorageService,
  selectIsAuthenticated,
  ROUTE_ANIMATIONS_ELEMENTS,
  AnimationsService,
  AuthGuardService,
  selectRouterState,
  selectEffectiveTheme,
  selectSettingsLanguage,
  selectSettingsStickyHeader
};

export function httpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    `${environment.i18nPrefix}/assets/i18n/`,
    '.json'
  );
}

@NgModule({
  imports: [
    // angular
    CommonModule,
    HttpClientModule,

    // ngrx
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: false,
        strictActionImmutability: false,
      },
    }),
    StoreRouterConnectingModule.forRoot(),
    EffectsModule.forRoot([
      AuthEffects,
      SettingsEffects
    ]),
    environment.production
      ? []
      : StoreDevtoolsModule.instrument({
        name: 'test'
      }),

    // 3rd party
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    AngularSvgIconModule.forRoot(),


    PanelMenuModule,
    BreadcrumbModule,
    TableModule,
    SidebarStateModule,
    SharedModule,
  ],
  declarations: [
    SidebarComponent,
    NavbarComponent,
    MainTemplateComponent,
    AuthTemplateComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpBaseInterceptor, multi: true },
    { provide: RouterStateSerializer, useClass: CustomSerializer },
    MessageService, ConfirmationService, DialogService, ApiService
  ],
  exports: [

    SidebarComponent,
    NavbarComponent,
    BreadcrumbModule,
    TableModule,

    // 3rd party
    TranslateModule,
    AngularSvgIconModule

  ],
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule,
  ) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule');
    }
  }
}
