import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SignInComponent} from "@pages/auth/sign-in/sign-in.component";

const routes: Routes = [
  {
    path: 'sign-in',
    component: SignInComponent
  },
  {
    path:'',
    component:SignInComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
