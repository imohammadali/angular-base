import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthTemplateComponent} from "./_theme/auth-template/auth-template.component";
import {MainTemplateComponent} from "./_theme/main-template/main-template.component";
import {AuthGuardService} from "@core/auth/auth-guard.service";
import {NotFindTemplateComponent} from "./_theme/not-find-template/not-find-template.component";

export const routes: Routes = [
  {
    path: '',
    component: MainTemplateComponent,
    canLoad: [AuthGuardService],
    children: [
      {
        path: '',
        redirectTo: 'dashboard/main',
        pathMatch: 'full',
      },
    ]
  },
  {
    path: 'auth',
    component: AuthTemplateComponent,
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: '404',
    component: NotFindTemplateComponent,
  },
  { path: '**', redirectTo: '404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
